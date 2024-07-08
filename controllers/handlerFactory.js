const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const AppFeatures = require("../utils/appFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(404, "No document found with Id!"));
    }

    return res.status(200).json({
      status: "success",
      message: `${doc.__type} deleted!`,
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc = await Model.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });

    console.log(doc);

    if (!doc) {
      return next(new AppError(404, `No document with given ID found!`));
    }

    return res.status(200).json({
      status: "success",
      message: `${doc.__type} have been updated`,
      data: doc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    let doc = await Model.create(req.body);
    return res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    //const id = new mongoose.Types.ObjectId(req.params.id);
    let query = Model.findById(req.params.id);

    if (popOptions) query.populate(popOptions);

    let doc = await query;

    if (!doc) {
      return next(new AppError(404, "No document with Id found!"));
    }
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.getAll = (Model, selectOptions) =>
  catchAsync(async (req, res, next) => {
    //Allow nested Get Tour Reviews...
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    let query = Model.find(filter);

    if (selectOptions) query = query.select(selectOptions);

    const appFeatures = new AppFeatures(query, req.query)
      .filter()
      .sort()
      .limit()
      .pagination();

    //Excecute Query
    // let docs = await appFeatures.query.explain(); more infrmation about indexes...

    let docs = await appFeatures.query;

    if (docs.length == 0)
      next(new AppError(500, "Try again!, by providing fields properly!"));

    return res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  });
