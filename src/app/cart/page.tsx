"use client";

import Header from "@/app/common/header";
import Footer from "@/app/common/footer";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./cart.module.css";  // 引入样式模块

interface CartItem {
    itemId: string;
    productId: string;
    productName: string;
    listPrice: number;
    attribute1: string | null;
    attribute2: string | null;
    attribute3: string | null;
    attribute4: string | null;
    attribute5: string | null;
    quantity: number;
    total: number;
    inStock: boolean;
}

interface CartData {
    username: string;
    itemList: CartItem[];
    numberOfItems: number;
    subTotal: number;
}

interface FavoriteItem {
    productId: string;
    categoryId: string;
    name: string;
    description: string;
}

export default function Cart() {
    const [cartData, setCartData] = useState<CartData | null>(null);
    const [favoriteList, setFavoriteList] = useState<FavoriteItem[]>([]);  // 新增状态来存储喜爱商品
    const [quantity, setQuantity] = useState<{ [key: string]: number }>({});

    // 获取购物车数据
    const fetchCartData = async () => {
        try {
            const response = await fetch("http://localhost:8080/carts");
            const data = await response.json();
            if (data.status === 0) {
                setCartData(data.data);
            } else {
                alert(data.message);
                selfAddCartData();
            }
        } catch (error) {
            console.error("Error fetching cart data", error);
        }
    };

    // 获取喜爱商品数据
    const fetchFavoriteList = async () => {
        try {
            const response = await fetch("http://localhost:8080/favouriteList");
            const data = await response.json();
            if (data.status === 0) {
                setFavoriteList(data.data);  // 设置喜爱商品列表
            } else {
                alert(data.message);
                selfAddFavoriteListData();
            }
        } catch (error) {
            console.error("Error fetching favorite list", error);
        }
    };

     // 模拟购物车数据
     const selfAddCartData = () => {
      setCartData({
          username: "j2ee",
          itemList: [
              {
                  itemId: "EST-1",
                  productId: "FI-SW-01",
                  productName: "Angelfish",
                  listPrice: 16.50,
                  attribute1: "Large",
                  attribute2: null,
                  attribute3: null,
                  attribute4: null,
                  attribute5: null,
                  quantity: 10000,
                  total: 16.50,
                  inStock: true
              },
              {
                  itemId: "EST-20",
                  productId: "FI-FW-02",
                  productName: "Goldfish",
                  listPrice: 5.50,
                  attribute1: "Adult Male",
                  attribute2: null,
                  attribute3: null,
                  attribute4: null,
                  attribute5: null,
                  quantity: 10000,
                  total: 5.50,
                  inStock: true
              }
          ],
          numberOfItems: 2,
          subTotal: 22.00
      });
  };

  // 模拟喜爱商品数据
  const selfAddFavoriteListData = () => {
      setFavoriteList([
          {
              productId: "FL-DLH-02",
              categoryId: "CATS",
              name: "Persian",
              description: "<image src=\"../images/cat1.gif\"><span id=\"itemDescription\">Friendly house cat, doubles as a princess</span>",
          },
          {
              productId: "FL-DSH-01",
              categoryId: "CATS",
              name: "Manx",
              description: "<image src=\"../images/cat2.gif\"><span id=\"itemDescription\">Great for reducing mouse populations</span>",
          }
      ]);
  };


    useEffect(() => {
        fetchCartData();       // 获取购物车数据
        fetchFavoriteList();   // 获取喜爱商品数据
    }, []);

    const handleQuantityChange = async (itemId: string, newQuantity: number, currentQuantity: number) => {
      try {
          // 发送 PUT 请求更新商品数量
          const response = await fetch(`http://localhost:8080/carts/${itemId}?quantity=${newQuantity}`, {
              method: 'PUT',
          });

          const data = await response.json();
          if (data.status === 0) {
              // 更新成功
              alert('Quantity updated successfully');
              // 更新商品的数量、总价等数据
              const updatedItemList = cartData?.itemList.map(item => 
                  item.itemId === itemId ? { ...item, quantity: newQuantity, total: item.listPrice * newQuantity } : item
              ) || [];
              
              setCartData({
                  ...cartData!,
                  itemList: updatedItemList,
                  subTotal: updatedItemList.reduce((acc, item) => acc + item.total, 0)
              });
          } else if (data.status === 2) {
              // 库存不足
              alert("Not Enough Stock");
              // 恢复原来的数量
              const updatedItemList = cartData?.itemList.map(item => 
                  item.itemId === itemId ? { ...item, quantity: currentQuantity } : item
              ) || [];

              setCartData({
                  ...cartData!,
                  itemList: updatedItemList
              });
          } else {
              alert(data.message);
          }
      } catch (error) {
          console.error("Error updating quantity", error);
          alert('Error updating quantity');
      }
    };

    const handleRemoveItem = async (itemId: string) => {
      try {
          const response = await fetch(`http://localhost:8080/carts/${itemId}`, {
              method: 'DELETE',
          });

          const data = await response.json();
          if (data.status === 0) {
              alert('Item successfully removed from the cart.');

              // 移除商品行
              const updatedItemList = cartData?.itemList.filter(item => item.itemId !== itemId) || [];
              setCartData({
                  ...cartData!,
                  itemList: updatedItemList,
                  numberOfItems: updatedItemList.length,
                  subTotal: updatedItemList.reduce((acc, item) => acc + item.total, 0)
              });
          } else {
              alert('Failed to remove item: ' + data.message);
          }
      } catch (error) {
          console.error('Error removing item from cart', error);
          alert('Error removing item from cart');
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
      //将输入框的值转化为数字
      const value = Number(e.target.value);  //转换为数字类型
      setQuantity(prev => ({
          ...prev,
          [itemId]: value  
      }));
    };
  
    return (
        <>
            <Header />
            <div className={styles.cartContainer}>
                <div id="Catalog">
                    <div id="Cart">
                        <h2 className={styles.title}>Shopping Cart</h2>
                        {cartData?.numberOfItems === 0 ? (
                            <p>Your cart is empty.</p>
                        ) : (
                            <table id="table" className={styles.show}>
                                <thead>
                                    <tr>
                                        <th><b>Item ID</b></th>
                                        <th><b>Product ID</b></th>
                                        <th><b>Description</b></th>
                                        <th><b>In Stock?</b></th>
                                        <th><b>Quantity</b></th>
                                        <th><b>List Price</b></th>
                                        <th><b>Total Cost</b></th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartData?.itemList.map((cartItem) => (
                                        <tr key={cartItem.itemId}>
                                            <td>
                                                <Link href={`/item/${cartItem.itemId}`}>
                                                    {cartItem.itemId}
                                                </Link>
                                            </td>
                                            <td>{cartItem.productId}</td>
                                            <td>
                                                {cartItem.attribute1 && <span>{cartItem.attribute1}</span>}
                                                {cartItem.attribute2 && <span>{cartItem.attribute2}</span>}
                                                {cartItem.attribute3 && <span>{cartItem.attribute3}</span>}
                                                {cartItem.attribute4 && <span>{cartItem.attribute4}</span>}
                                                {cartItem.attribute5 && <span>{cartItem.attribute5}</span>}
                                                <span>{cartItem.productName}</span>
                                            </td>
                                            <td>{cartItem.inStock ? "Yes" : "No"}</td>
                                            <td>
                                              <input
                                                    type="number"
                                                    value={quantity[cartItem.itemId] || cartItem.quantity}
                                                    onChange={(e) => handleInputChange(e, cartItem.itemId)}
                                                    onBlur={(e) =>
                                                        handleQuantityChange(cartItem.itemId, Number(e.target.value), cartItem.quantity)
                                                    }
                                                />
                                            </td>
                                            <td>{cartItem.listPrice.toFixed(2)}</td>
                                            <td>
                                                <div className="total">{cartItem.total.toFixed(2)}</div>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(cartItem.itemId)}
                                                    className={styles.removeButton}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={8}>
                                            <p id="subTotal" style={{ fontWeight: "bold", textAlign: "center" }}>
                                                Sub Total: <span>{cartData?.subTotal.toFixed(2)}</span>
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={8} className={styles.cartButton}>
                                            <p style={{ textAlign: "center" }}>
                                                <button className={styles.updateButton}>Update Cart</button>
                                                {cartData && cartData?.numberOfItems > 0 && (
                                                    <span>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                                        <Link href="/order">
                                                            <button type="button" className={styles.Button}>
                                                                Proceed to Checkout
                                                            </button>
                                                        </Link>
                                                    </span>
                                                )}
                                            </p>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        )}

                         {/* 喜爱商品列表 */}
                         {favoriteList.length > 0 && (
                            <div className={styles.MyList}>
                                <h2 className={styles.title}>Pet Favorites</h2>
                                <p>Shop for more of your favorite pets here.</p>
                                <ul>
                                    {favoriteList.map((favItem) => (
                                        <li key={favItem.productId}>
                                            <Link href={`/item/${favItem.productId}`}>
                                                <span className={styles.favItemName}>{favItem.name}</span>
                                                <span> ({favItem.productId})</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

