const pool = require("../db");

exports.findChannelInServer = async ({ serverId, channelId }) => {
  return pool.query(
    `
      SELECT id
      FROM channels
      WHERE id = $1 AND server_id = $2
      LIMIT 1
    `,
    [channelId, serverId]
  );
};

exports.findUserById = async (userId) => {
  return pool.query(
    `
      SELECT id
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [userId]
  );
};

exports.createMessage = async ({ channelId, authorId, content }) => {
  return pool.query(
    `
      INSERT INTO messages (channel_id, author_id, content)
      VALUES ($1, $2, $3)
      RETURNING id, channel_id, author_id, content, created_at, edited_at
    `,
    [channelId, authorId, content]
  );
};

exports.listMessages = async ({ channelId, before, after, limit = 50 }) => {
  let values = [channelId];
  let conditions = [`m.channel_id = $1`];
  let paramIndex = 2;

  if (after) {
    conditions.push(`
      m.created_at > (      router.post("/", sendMessage);
        SELECT created_at FROM messages WHERE id = $${paramIndex}
      )
    `);
    values.push(after);
    paramIndex++;
  }

  if (before) {
    conditions.push(`
      m.created_at < (
        SELECT created_at FROM messages WHERE id = $${paramIndex}
      )
    `);
    values.push(before);
    paramIndex++;
  }

  const query = `
SELECT 
  m.id,
  m.content,
  m.created_at,

  COALESCE(
    json_agg(DISTINCT jsonb_build_object(
      'id', a.id,
      'file_url', a.file_url,
      'file_name', a.file_name
    )) FILTER (WHERE a.id IS NOT NULL),
    '[]'
  ) AS attachments,

  COALESCE(
    json_agg(DISTINCT jsonb_build_object(
      'id', r.id,
      'emoji', r.emoji,
      'user_id', r.user_id,
      'username', u.username
    )) FILTER (WHERE r.id IS NOT NULL),
    '[]'
  ) AS reactions

FROM messages m

LEFT JOIN message_attachments a 
  ON m.id = a.message_id

LEFT JOIN message_reactions r 
  ON m.id = r.message_id

LEFT JOIN users u 
  ON r.user_id = u.id

WHERE ${conditions.join(" AND ")}

GROUP BY m.id
ORDER BY m.created_at DESC
LIMIT $${paramIndex};
`;

  values.push(limit);

  console.log("QUERY:", query);
  console.log("VALUES:", values);

  return pool.query(query, values);
};

exports.updateMessage = async ({ channelId, messageId, content, deleteAttachmentIds = [], hasContent }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existing = await client.query(
      `
        SELECT id
        FROM messages
        WHERE id = $1 AND channel_id = $2
        LIMIT 1
      `,
      [messageId, channelId]
    );

    if (existing.rowCount === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    let messageResult;

    if (hasContent) {
      messageResult = await client.query(
        `
          UPDATE messages
          SET content = $3,
              edited_at = now()
          WHERE id = $1 AND channel_id = $2
          RETURNING id, channel_id, author_id, content, created_at, edited_at
        `,
        [messageId, channelId, content]
      );
    } else {
      messageResult = await client.query(
        `
          SELECT id, channel_id, author_id, content, created_at, edited_at
          FROM messages
          WHERE id = $1 AND channel_id = $2
        `,
        [messageId, channelId]
      );
    }

    let deletedAttachmentIds = [];
    if (Array.isArray(deleteAttachmentIds) && deleteAttachmentIds.length > 0) {
      const deleteResult = await client.query(
        `
          DELETE FROM message_attachments
          WHERE message_id = $1 AND id = ANY($2::uuid[])
          RETURNING id
        `,
        [messageId, deleteAttachmentIds]
      );

      deletedAttachmentIds = deleteResult.rows.map((row) => row.id);
    }

    await client.query("COMMIT");

    return {
      message: messageResult.rows[0],
      deletedAttachmentIds,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

exports.deleteMessage = async ({ channelId, messageId }) => {
  const result = await pool.query(
    `
      DELETE FROM messages
      WHERE id = $1 AND channel_id = $2
      RETURNING id, channel_id, author_id, content, created_at, edited_at
    `,
    [messageId, channelId]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
};

//  ADD REACTION
exports.addReaction = async ({ messageId, userId, emoji }) => {
  const query = `
    INSERT INTO message_reactions (message_id, user_id, emoji)
    VALUES ($1, $2, $3)
    ON CONFLICT DO NOTHING
  `;

  return pool.query(query, [messageId, userId, emoji]);
};

// REMOVE REACTION
exports.removeReaction = async ({ messageId, userId, emoji }) => {
  const query = `
    DELETE FROM message_reactions
    WHERE message_id = $1 AND user_id = $2 AND emoji = $3
  `;

  return pool.query(query, [messageId, userId, emoji]);
};