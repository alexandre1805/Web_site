exports.getGames = async function (req, res) {
  res.status(200).json({ games: [{ name: "tic-tac-toe" }] });
};
