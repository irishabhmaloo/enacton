//@ts-nocheck
"use server";

import { sql } from "kysely";
import { DEFAULT_PAGE_SIZE } from "../../constant";
import { db } from "../../db";
import { InsertProducts, UpdateProducts } from "@/types";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/utils/authOptions";
import { cache } from "react";

export async function getProducts(pageNo = 1, pageSize = DEFAULT_PAGE_SIZE, gender, sortBy, categoryId, priceRangeTo, discount, brandId, occasions) {
  try {
    let products;
    let dbQuery = db.selectFrom("products").selectAll("products")

    if (gender) {
      dbQuery = dbQuery.where('products.gender', '=', gender);
    }
    if (categoryId) {
      dbQuery = dbQuery.where('products.categoryId', '=', categoryId);
    }
    if (priceRangeTo) {
      dbQuery = dbQuery.where('products.price', '<=', priceRangeTo);
    }
    if (discount) {
      dbQuery = dbQuery.where('products.discount', '>=', parseFloat(discount.split('-')[0])).where('products.discount', '<=', parseFloat(discount.split('-')[1]));
    }
    if (brandId) {
      dbQuery = dbQuery.where('products.brands', 'like', '%' + brandId + '%');
    }
    if (occasions && occasions.length > 0) {
      dbQuery = dbQuery.where('products.occasion', 'like', '%' + occasions + '%');
    }
    if (sortBy) {
      dbQuery = dbQuery.orderBy("products." + sortBy.split('-')[0], sortBy.split('-')[1]);
    }

    const result = await dbQuery
      .execute(sql`SELECT COUNT(DISTINCT products.id) as count`);
    
    // console.log(Object.keys(result).length);

    const count = Object.keys(result).length;

    // console.log(count);
    const lastPage = Math.ceil(count / pageSize);
    // console.log(lastPage);
    products = await dbQuery
      .distinct()
      .offset((pageNo - 1) * pageSize)
      .limit(pageSize)
      .execute();

    const numOfResultsOnCurPage = products.length;

    return { products, count, lastPage, numOfResultsOnCurPage };
  } catch (error) {
    throw error;
  }
}

export const getProduct = cache(async function getProduct(productId: number) {
  // console.log("run");
  try {
    const product = await db
      .selectFrom("products")
      .selectAll()
      .where("id", "=", productId)
      .execute();

    return product;
  } catch (error) {
    return { error: "Could not find the product" };
  }
});

async function enableForeignKeyChecks() {
  await sql`SET foreign_key_checks = 1`.execute(db);
}

async function disableForeignKeyChecks() {
  await sql`SET foreign_key_checks = 0`.execute(db);
}

export async function deleteProduct(productId: number) {
  try {
    await disableForeignKeyChecks();
    await db
      .deleteFrom("product_categories")
      .where("product_categories.product_id", "=", productId)
      .execute();
    await db
      .deleteFrom("reviews")
      .where("reviews.product_id", "=", productId)
      .execute();

    await db
      .deleteFrom("comments")
      .where("comments.product_id", "=", productId)
      .execute();

    await db.deleteFrom("products").where("id", "=", productId).execute();

    await enableForeignKeyChecks();
    revalidatePath("/products");
    return { message: "success" };
  } catch (error) {
    return { error: "Something went wrong, Cannot delete the product" };
  }
}

export async function MapBrandIdsToName(brandsId) {
  const brandsMap = new Map();
  try {
    for (let i = 0; i < brandsId.length; i++) {
      const brandId = brandsId.at(i);
      const brand = await db
        .selectFrom("brands")
        .select("name")
        .where("id", "=", +brandId)
        .executeTakeFirst();
      brandsMap.set(brandId, brand?.name);
    }
    return brandsMap;
  } catch (error) {
    throw error;
  }
}

export async function getAllProductCategories(products: any) {
  try {
    const productsId = products.map((product) => product.id);
    const categoriesMap = new Map();

    for (let i = 0; i < productsId.length; i++) {
      const productId = productsId.at(i);
      const categories = await db
        .selectFrom("product_categories")
        .innerJoin(
          "categories",
          "categories.id",
          "product_categories.category_id"
        )
        .select("categories.name")
        .where("product_categories.product_id", "=", productId)
        .execute();
      categoriesMap.set(productId, categories);
    }
    return categoriesMap;
  } catch (error) {
    throw error;
  }
}

export async function getProductCategories(productId: number) {
  try {
    const categories = await db
      .selectFrom("product_categories")
      .innerJoin(
        "categories",
        "categories.id",
        "product_categories.category_id"
      )
      .select(["categories.id", "categories.name"])
      .where("product_categories.product_id", "=", productId)
      .execute();

    return categories;
  } catch (error) {
    throw error;
  }
}


// added by me
export async function addProduct(value: InsertProducts) {
  try {
    await db.insertInto("products").values(value).execute();
    revalidatePath("/products");
    return { message: "success" };
  } catch (error) {
    return { error: error.message };
  }
}

export async function updateProduct(productId: number, value: UpdateProducts) {
  try {
    await db
      .updateTable("products")
      .set(value)
      .where("products.id", "=", productId)
      .execute();
    revalidatePath("/products");
    return { message: "success" };
  } catch (error) {
    return { error: error.message };
  }
}
