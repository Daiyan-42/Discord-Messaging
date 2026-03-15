const pool = require("../db");

exports.listMessages = async (req, res) => {
  const { serverId, channelId } = req.params;
  const { limit = 50, before, after } = req.query;

  try {
    let query = `
      SELECT *
      FROM messages
      WHERE channel_id = $1
    `;

    const values = [channelId];
    let paramIndex = 2;

    if (before) {
      query += ` AND id < $${paramIndex}`;
      values.push(before);
      paramIndex++;
    }

    if (after) {
      query += ` AND id > $${paramIndex}`;
      values.push(after);
      paramIndex++;
    }

    query += `
      ORDER BY created_at DESC
      LIMIT $${paramIndex}
    `;

    values.push(parseInt(limit));

    const result = await pool.query(query, values);

    res.json({
      messages: result.rows,
      count: result.rows.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};