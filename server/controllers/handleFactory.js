const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const { Model } = require('mongoose');
const fs = require('fs');

exports.deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) return next(new AppError('No transaction found with that Id', 404));

        res.status(204).json({
            status: 'success',
            data: null
        });
    });
    

exports.updateOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!doc) return next(new AppError('No transaction found with that Id', 404));

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });


exports.createOne = Model => 
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });

exports.getOne = Model => 
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);

        const doc = await query;
        if (!doc) return next(new AppError('No transaction found with that Id', 404));

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });
   

exports.getAll = Model => 
    catchAsync(async (req, res, next) => {
        const query = Model.find({});

        const doc = await query;

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc
            }
        });
    });

exports.uploadtransactions = Model => 
    catchAsync(async (req, res, next) => {
        let data  = fs.readFileSync(req.file.path);
        data  = JSON.parse(data);
        const doc = await Model.create(data);

        res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });



    