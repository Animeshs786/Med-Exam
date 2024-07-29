const Home = require("../../../models/home");

exports.addFaq = async (req, res, next) => {
  try {
    const home = await Home.findById("66a363460971bf6ac5286aa4");
    home.faq.push(req.body.faq);
    await home.save();

    res.status(200).json({
      status: true,
      message: "Faq added successfully",
    });
  } catch (err) {
    next(err);
  }
};
