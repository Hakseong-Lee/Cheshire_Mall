import express from 'express';
import path from 'path';
const productRouter = express.Router();

import { loginRequired, adminConfirm } from '../middlewares';

import { productModel } from '../db/models/product-model.js';
import { categoryModel } from '../db/models/category-model.js';

import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

// // 상품 전체 보기 (카테고리별)
// productRouter.get('/list', async(req,res,next)=>{
//     try{
//         //product/list/?category=Man%20Clothes
//         const {category} = req.query;
//         // 상품 카테고리를 기준으로 전부 검색
//         const products = await productModel.find({}).populate({
//             path : 'category',
//             match : {name : category}
//         });
//         // 상품들 정보를 프론트에 전달
//         res.status(200).json(products);
//         console.log('hi');
//     }catch(err){
//         next(err);
//     }
// });

// 상품 전체 보기 (카테고리별)

productRouter.get('/list/:category', async (req, res, next) => {
  try {
    const category = req.params.category;
    // 상품 전체 검색
    const products = await productModel.find({ category }).populate('category');

    // 상품들 정보를 프론트에 전달
    res.status(200).json(products);
    console.log('hi');
  } catch (err) {
    next(err);
  }
});

// 상품 상세 보기
productRouter.get('/detail/:product_id', async (req, res, next) => {
  try {
    // product/detail/6
    const product_id = req.params.product_id;
    // product_id로 상품 하나 찾기
    const product = await productModel
      .find({ product_id })
      .populate('category');

    // 상품 데이터 프론트에 전달
    res.status(200).json(product);
    console.log('asdf');
  } catch (err) {
    next(err);
  }
});

// 상품 추가
productRouter.post(
  '/add',
  adminConfirm,
  upload.single('image'),
  async (req, res, next) => {
    try {
      const { name, category, inform, price, storage, date, company } =
        req.body;
      const image = req.file.path;
      //////////////////// 입력값 빠졌는지 검사 //////////////////////////
      if (name == '') {
        throw new Error('상품 이름을 입력해주세요!');
      }
      if (image == '') {
        throw new Error('상품 이미지를 업로드해주세요!');
      }
      if (category == '') {
        throw new Error('상품 카테고리를 입력해주세요!');
      }
      if (inform == '') {
        throw new Error('상품 설명을 입력해주세요!');
      }
      if (price == '') {
        throw new Error('상품 가격을 입력해주세요!');
      }
      if (storage == '') {
        throw new Error('상품 재고를 입력해주세요!');
      }
      if (date == '') {
        throw new Error('상품 출시 날짜를 입력해주세요!');
      }
      if (company == '') {
        throw new Error('상품 제조사를 입력해주세요!');
      }

      const newProductCategory = await productModel.create({
        name,
        category,
        image,
        inform,
        price,
        storage,
        date,
        company,
      });

      // 카테고리 모델에 상품 모델 추가
      const thisCategory = await categoryModel
        .findOneAndUpdate(
          { _id: category },
          { $push: { products: newProductCategory } },
          { new: true }
        )
        .populate('products');

      // 상품 모델이 생성되었음을 알리고 데이터를 프론트에 전달
      res.status(201).json(newProductCategory);
      console.log('상품 추가 완료');
    } catch (err) {
      next(err);
    }
  }
);

// 상품 삭제
productRouter.delete(
  '/detail/:product_id',
  adminConfirm,
  async (req, res, next) => {
    try {
      // product/detail/26
      const product_id = req.params.product_id;

      const oldModel = await productModel.findOne({ product_id });
      const oldModelCategoryId = oldModel.category;
      await categoryModel.updateOne(
        { _id: oldModelCategoryId },
        { $pull: { products: oldModel._id } }
      );

      // 해당 상품 name을 가진 상품 데이터를 삭제
      const deleteProduct = await productModel
        .deleteOne({ product_id })
        .populate('category');

      res.status(200).json(deleteProduct);
      console.log('상품이 삭제되었습니다');
    } catch (err) {
      next(err);
    }
  }
);

// 상품 정보 수정
// req.body 데이터 전부 보내기
productRouter.post(
  '/update_product/:product_id',
  adminConfirm,
  upload.single('image'),
  async (req, res, next) => {
    try {
      // product/update_product/6
      const product_id = req.params.product_id;

      //  상품 정보 수정하기 위해 값을 받아오기
      const { name, category, inform, price, storage, date, company } =
        req.body;
      const image = req.file.path;
      // 입력값 빠졌는지 검사
      if (name == '') {
        throw new Error('상품 이름을 입력해주세요!');
      }
      if (category == '') {
        throw new Error('상품 카테고리를 입력해주세요!');
      }
      if (image == '') {
        throw new Error('상품 이미지를 업로드해주세요!');
      }
      if (inform == '') {
        throw new Error('상품 설명을 입력해주세요!');
      }
      if (price == '') {
        throw new Error('상품 가격을 입력해주세요!');
      }
      if (storage == '') {
        throw new Error('상품 재고를 입력해주세요!');
      }
      if (date == '') {
        throw new Error('상품 출시 날짜를 입력해주세요!');
      }
      if (company == '') {
        throw new Error('상품 제조사를 입력해주세요!');
      }

      // // 기존 카테고리에서 상품 제거
      const oldModel = await productModel.findOne({ product_id });
      const oldModelCategoryId = oldModel.category;
      await categoryModel.updateOne(
        { _id: oldModelCategoryId },
        { $pull: { products: oldModel._id } }
      );

      // body 값들을 받아와 상품 정보 수정
      const updateProduct = await productModel
        .findOneAndUpdate(
          { product_id },
          { name, category, image, inform, price, storage, date, company }
        )
        .populate('category');

      // 카테고리에 상품 추가
      const newModel = await productModel.findOne({ product_id });
      const newModelCategoryId = newModel.category;
      await categoryModel
        .updateOne(
          { _id: newModelCategoryId },
          { $push: { products: newModel._id } }
        )
        .populate('products');

      res.status(200).json(updateProduct);
      console.log('상품 정보 수정이 완료되었습니다');
    } catch (err) {
      next(err);
    }
  }
);

export { productRouter };
