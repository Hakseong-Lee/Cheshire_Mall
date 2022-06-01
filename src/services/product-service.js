import { productModel } from '../db';

class ProductService {
  // 본 파일의 맨 아래에서, new ProductService(productModel) 하면, 이 함수의 인자로 전달됨
  constructor(productModel) {
    this.productModel = productModel;
  }

  // 상품 등록
  async addProduct(productInfo) {
    // db에 저장
    const createdNewProduct = await this.productModel.create(productInfo);

    return createdNewProduct;
  }

  // 상품 목록을 받음.
  async getProducts() {
    const products = await this.productModel.findAll();
    return products;
  }

  // 상품 정보 수정
  async setProduct(productId, toUpdate) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let product = await this.productModel.findById(productId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      throw new Error(
        '해당 상품이 존재하지 않습니다. 다시 한 번 확인해 주세요.'
      );
    }

    // 업데이트 진행
    product = await this.productModel.update({
      productId,
      update: toUpdate,
    });

    return product;
  }
}

const productService = new ProductService(productModel);

export { productService };
