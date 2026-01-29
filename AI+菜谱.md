# AI+菜谱



## 1、概念与目标

#### 核心概念：

开发一款结合AI技术的菜谱应用软件，能够基于用户口味、食材库存等个性化推荐菜谱，并提供详细的烹饪步骤和建议。

#### 目标：

- **个性化推荐**：根据用户的口味偏好和食材库存，推荐个性化菜谱。
- **实用烹饪指导**：提供详细的烹饪步骤和建议，帮助用户轻松制作美味佳肴。
- 预期成品示例图、原料图



## 2、需求

1、用户填写食材库、和口味喜好并持久化存储

2、通过AI生成推荐的菜谱(包含详细的烹饪步骤和建议)

3、生成的菜谱带有成品示例图(通过ai生成)

### 

## 3、设计

模块：个性化模块、菜谱生成模块

个性化模块：用户可以填写口味喜欢、填写材料库(ai根据填写的内容自动拆分成标签，方便用户查看、修改(可以不用，用户可以删除错误的后重新添加就行)、删除)

菜谱生成模块：用户确认当前个性内容正确后点击一个按钮、就会生成一些菜谱，按推荐排序(推荐顺序由ai决定)，呈现列表展示，展示内容有这个菜的名字、菜的成品示例图、材料，点击这个菜谱时进入详情页，详情页里面包含材料多少、烹饪步骤、建议



## 4、开发

技术：

​	前端：vue3、element plus

​	后端：spring boot、spring ai、mybatis plus、Swagger 

​	数据库：mysql

​	大模型：兼容openai api风格的模型

​	部署：nginx、docker

架构：前后端分离

数据库设计：

用户表user

| 列名       | 数据类型 | 约束条件           | 注释               |
| ---------- | -------- | ------------------ | ------------------ |
| user_id    | INT      | PK, Auto Increment | 用户ID             |
| username   | VARCHAR  |                    | 用户名             |
| password   | VARCHAR  |                    | 密码（加密后存储） |
| email      | VARCHAR  | UNIQUE             | 用户邮箱           |
| created_at | DATETIME |                    | 创建时间           |
| updated_at | DATETIME |                    | 更新时间           |

用户口味偏好表

| 列名            | 数据类型 | 约束条件           | 注释         |
| --------------- | -------- | ------------------ | ------------ |
| preference_id   | INT      | PK, Auto Increment | 偏好ID       |
| user_id         | INT      | FK                 | 用户ID       |
| preference_name | VARCHAR  |                    | 口味偏好名称 |
| created_at      | DATETIME |                    | 创建时间     |
| updated_at      | DATETIME |                    | 更新时间     |

食材库存表

| 列名         | 数据类型 | 约束条件           | 注释     |
| ------------ | -------- | ------------------ | -------- |
| inventory_id | INT      | PK, Auto Increment | 库存ID   |
| user_id      | INT      | FK                 | 用户ID   |
| food_name    | VARCHAR  |                    | 食材名字 |
| quantity     | INT      |                    | 食材数量 |
| created_at   | DATETIME |                    | 创建时间 |
| updated_at   | DATETIME |                    | 更新时间 |

菜谱表

| 列名           | 数据类型 | 约束条件           | 注释                 |
| -------------- | -------- | ------------------ | -------------------- |
| menu_id        | INT      | PK, Auto Increment | 菜谱ID               |
| user_id        | INT      | FK                 | 用户ID               |
| menu_name      | VARCHAR  |                    | 菜谱名称             |
| ingredients    | TEXT     |                    | 食材（JSON格式）     |
| steps          | TEXT     |                    | 烹饪步骤（JSON格式） |
| recommendation | TEXT     |                    | 烹饪建议             |
| created_at     | DATETIME |                    | 创建时间             |
| updated_at     | DATETIME |                    | 更新时间             |

成品示例图表

| 列名       | 数据类型 | 约束条件           | 注释       |
| ---------- | -------- | ------------------ | ---------- |
| image_id   | INT      | PK, Auto Increment | 图片ID     |
| menu_id    | INT      | FK, UNIQUE         | 菜谱ID     |
| image_url  | VARCHAR  |                    | 成品图链接 |
| created_at | DATETIME |                    | 创建时间   |
| updated_at | DATETIME |                    | 更新时间   |

接口设计：                                                                                                                                                                                            

#### 1. 用户模块

##### 1.1 用户注册/登录

- **创建用户**
  - **请求方法:** POST
  - **请求路径:** `/api/user/register`
  - **请求参数:** 
    - `username`: String
    - `password`: String
    - `email`: String
  - **响应:** `user_id`

  - **示例:**

    ```json
    {
      "username": "JohnDoe",
      "password": "password123",
      "email": "johndoe@example.com"
    }
    ```

- **用户登录**
  - **请求方法:** POST
  - **请求路径:** `/api/user/login`
  - **请求参数:** 
    - `username`: String
    - `password`: String
  - **响应:** `token`

  - **示例:**

    ```json
    {
      "username": "JohnDoe",
      "password": "password123"
    }
    ```

##### 1.2 获取用户信息
  - **请求方法:** GET
  - **请求路径:** `/api/user/info/:user_id`
  - **响应:** 用户信息

  - **示例:**

    ```json
    {
      "username": "JohnDoe",
      "user_id": 1,
      "email": "johndoe@example.com"
    }
    ```

#### 2. 个性化模块

##### 2.1 用户口味偏好管理

- **添加/更新用户口味偏好**
  - **请求方法:** POST/PATCH
  - **请求路径:** `/api/user/preferences`
  - **请求参数:** `user_id`, `preference_name`
  - **响应:** 成功与否信息

  - **示例:**

    ```json
    {
      "user_id": 1,
      "preference_name": "Spicy"
    }
    ```

- **删除用户口味偏好**
  - **请求方法:** DELETE
  - **请求路径:** `/api/user/preferences/:preference_id`
  - **参数:** `preference_id`
  - **响应:** 成功与否信息

##### 2.2 用户食材库存管理

- **添加/更新用户食材库存**
  - **请求方法:** POST/PATCH
  - **请求路径:** `/api/user/inventory`
  - **请求参数:** `user_id`, `food_name`, `quantity`
  - **响应:** 成功与否信息

- **删除用户食材库存**
  - **请求方法:** DELETE
  - **请求路径:** `/api/user/inventory/:inventory_id`
  - **参数:** `inventory_id`
  - **响应:** 成功与否信息

#### 3. 菜谱生成模块

##### 3.1 获取推荐菜谱列表

- **请求方法:** GET
  - **请求路径:** `/api/recipes/recommendations`
  - **请求参数:** `user_id`
  - **响应:** 菜谱列表

  - **示例:**

    ```json
    [
      {
        "menu_id": 1,
        "menu_name": "Spicy Chicken",
        "image_url": "http://example.com/image.jpg",
        "ingredients": ["chicken", "spices"],
        "steps": ["step1", "step2"],
        "recommendation": "Serve with rice",
        "created_at": "2023-01-01 00:00:00"
      }
    ]
    ```

##### 3.2 获取菜谱详情

- **请求方法:** GET
  - **请求路径:** `/api/recipe/:menu_id`
  - **参数:** `menu_id`
  - **响应:** 菜谱详情

- **示例:**

  ```json
  {
    "menu_id": 1,
    "menu_name": "Spicy Chicken",
    "image_url": "http://example.com/image.jpg",
    "ingredients": ["chicken", "spices"],
    "steps": ["step1", "step2"],
    "recommendation": "Serve with rice",
    "created_at": "2023-01-01 00:00:00"
  }
  ```
