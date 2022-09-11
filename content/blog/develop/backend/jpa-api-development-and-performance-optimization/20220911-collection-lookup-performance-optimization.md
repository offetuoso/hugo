---
title: "[스프링부트 JPA API개발 성능최적화] 컬렉션 조회 성능 최적화"
image: "bg-using-springboot-jpa.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-09-11
slug: "collection-lookup-performance-optimization.md"
description: "[스프링부트 JPA API개발 성능최적화] 컬렉션 조회 성능 최적화"
keywords: ["ORM"]
draft: true
categories: ["Java"]
subcategories: ["JPA"]
tags: ["스프링부트 JPA API개발 성능최적화","김영한","JPA","ORM","Java", "Spring" ,"인프런"]
math: false
toc: true
---

# 스프링부트 JPA API개발 성능최적화
-------------------------------

## 목차
----------------------------------
> 5. API 개발 기본
>	- 회원 등록 API
>	- 회원 수정 API
>	- 회원 조회 API
> 6. API 개발 고급
>	- 조회용 샘플 데이터 입력
>	- 지연 로딩과 조회 성능 최적화
>	- 컬렉션 조회 최적화
>	- 페이징과 한계 돌파
>	- OSIV와 성능 최적화
> 7. 다음으로
>	- 스프링 데이터 JPA 소개
>	- QueryDSL 소개
>	- 마무리

## API 개발 고급
-----------------------------------------

### 컬렉션 조회 최적화
-----------------------------------------
> - 주문내역에서 추가로 주문한 상품 정보를 추가로 조회.
> - Order 기준으로 컬렉션인 OrderItem과 Item이 필요.

> 앞의 예제에서는 toOne(OneToOne, ManyToOne) 관계를 살펴보며 최적화 하였습니다.
> 이번에는 컬렉션인 일대다(OneToMany) 관계를 조회하고 최적화해 보겠습니다.


### 주문 조회 V1 : 엔티티 직접 사용
> 엔티티 직접 사용하여 엔티티를 노출하는 것은 절대 안되지만, 최적화의 예시를 들기 위해 보여드리겠습니다.

> java/jpabook/jpashop/api/OrderApiController.java

```
package jpabook.jpashop.api;

import jpabook.jpashop.domain.Order;
import jpabook.jpashop.domain.OrderItem;
import jpabook.jpashop.dto.OrderSearch;
import jpabook.jpashop.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderApiController {
    private final OrderRepository orderRepository;

    @GetMapping("/api/v1/orders")
    private List<Order> ordersV1(){

        List<Order> orders = orderRepository.findAllByString(new OrderSearch());

        for (Order order : orders) {
            order.getMember().getName(); //Member 초기화
            order.getDelivery().getAddress(); //Delivery 초기화
            List<OrderItem> orderItems = order.getOrderItems();  //OrderItem 초기화
            orderItems.stream().forEach(o -> o.getItem().getName()); //OrderItem 내부의 Item 초기화
        }

        return orders;
    }
}

```

> /api/v1/orders

```
[
    {
        "id": 35,
        "member": {
            "id": 33,
            "name": "회원1",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        },
        "orderItems": [
            {
                "id": 37,
                "item": {
                    "id": 1,
                    "name": "앨범1",
                    "price": 10000,
                    "stockQuantity": 18,
                    "dtype": "A",
                    "categories": null,
                    "artist": "아티스트1",
                    "etc": "기타1",
                    "dtypeNm": "음반"
                },
                "orderPrice": 10000,
                "count": 2,
                "totalPrice": 20000
            }
        ],
        "delivery": {
            "id": 36,
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            },
            "status": "READY"
        },
        "orderDate": "2022-07-30T15:23:25.537696",
        "status": "CANCEL",
        "totalPrice": 20000
    },
    {
        "id": 88,
        "member": {
            "id": 33,
            "name": "회원1",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        },
        "orderItems": [
            {
                "id": 90,
                "item": {
                    "id": 1,
                    "name": "앨범1",
                    "price": 10000,
                    "stockQuantity": 18,
                    "dtype": "A",
                    "categories": null,
                    "artist": "아티스트1",
                    "etc": "기타1",
                    "dtypeNm": "음반"
                },
                "orderPrice": 10000,
                "count": 2,
                "totalPrice": 20000
            },
            {
                "id": 91,
                "item": {
                    "id": 2,
                    "name": "책1",
                    "price": 211,
                    "stockQuantity": 2108,
                    "dtype": "B",
                    "categories": null,
                    "author": "저자1",
                    "isbn": "ISBN1",
                    "dtypeNm": "책"
                },
                "orderPrice": 211,
                "count": 3,
                "totalPrice": 633
            }
        ],
        "delivery": {
            "id": 89,
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            },
            "status": "READY"
        },
        "orderDate": "2022-08-01T23:19:02.252476",
        "status": "ORDER",
        "totalPrice": 20633
    },
    {
        "id": 92,
        "member": {
            "id": 33,
            "name": "회원1",
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            }
        },
        "orderItems": [
            {
                "id": 94,
                "item": {
                    "id": 1,
                    "name": "앨범1",
                    "price": 10000,
                    "stockQuantity": 18,
                    "dtype": "A",
                    "categories": null,
                    "artist": "아티스트1",
                    "etc": "기타1",
                    "dtypeNm": "음반"
                },
                "orderPrice": 10000,
                "count": 2,
                "totalPrice": 20000
            },
            {
                "id": 95,
                "item": {
                    "id": 1,
                    "name": "앨범1",
                    "price": 10000,
                    "stockQuantity": 18,
                    "dtype": "A",
                    "categories": null,
                    "artist": "아티스트1",
                    "etc": "기타1",
                    "dtypeNm": "음반"
                },
                "orderPrice": 10000,
                "count": 1,
                "totalPrice": 10000
            },
            {
                "id": 96,
                "item": {
                    "id": 2,
                    "name": "책1",
                    "price": 211,
                    "stockQuantity": 2108,
                    "dtype": "B",
                    "categories": null,
                    "author": "저자1",
                    "isbn": "ISBN1",
                    "dtypeNm": "책"
                },
                "orderPrice": 211,
                "count": 1,
                "totalPrice": 211
            }
        ],
        "delivery": {
            "id": 93,
            "address": {
                "city": "도시1",
                "street": "거리1",
                "zipcode": "11111"
            },
            "status": "READY"
        },
        "orderDate": "2022-08-02T00:58:44.937685",
        "status": "CANCEL",
        "totalPrice": 30211
    }
]
```

> console

```
2022-09-11 16:33:55.723 DEBUG 19092 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        order0_.order_id as order_id1_6_,
        order0_.delivery_id as delivery4_6_,
        order0_.member_id as member_i5_6_,
        order0_.order_date as order_da2_6_,
        order0_.status as status3_6_ 
    from
        orders order0_ 
    left outer join
        member member1_ 
            on order0_.member_id=member1_.member_id limit ?


2022-09-11 16:33:55.793 DEBUG 19092 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        member0_.member_id as member_i1_4_0_,
        member0_.city as city2_4_0_,
        member0_.street as street3_4_0_,
        member0_.zipcode as zipcode4_4_0_,
        member0_.name as name5_4_0_ 
    from
        member member0_ 
    where
        member0_.member_id=?


2022-09-11 16:33:55.801 DEBUG 19092 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        delivery0_.delivery_id as delivery1_2_0_,
        delivery0_.city as city2_2_0_,
        delivery0_.street as street3_2_0_,
        delivery0_.zipcode as zipcode4_2_0_,
        delivery0_.status as status5_2_0_ 
    from
        delivery delivery0_ 
    where
        delivery0_.delivery_id=?


2022-09-11 16:33:55.806 DEBUG 19092 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        orderitems0_.order_id as order_id5_5_0_,
        orderitems0_.order_item_id as order_it1_5_0_,
        orderitems0_.order_item_id as order_it1_5_1_,
        orderitems0_.count as count2_5_1_,
        orderitems0_.item_id as item_id4_5_1_,
        orderitems0_.order_id as order_id5_5_1_,
        orderitems0_.order_price as order_pr3_5_1_ 
    from
        order_item orderitems0_ 
    where
        orderitems0_.order_id=?


2022-09-11 16:33:55.815 DEBUG 19092 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        item0_.item_id as item_id2_3_0_,
        item0_.dtype as dtype1_3_0_,
        item0_.name as name3_3_0_,
        item0_.price as price4_3_0_,
        item0_.stock_quantity as stock_qu5_3_0_,
        item0_.artist as artist6_3_0_,
        item0_.etc as etc7_3_0_,
        item0_.author as author8_3_0_,
        item0_.isbn as isbn9_3_0_,
        item0_.actor as actor10_3_0_,
        item0_.director as directo11_3_0_ 
    from
        item item0_ 
    where
        item0_.item_id=?


2022-09-11 16:33:55.818 DEBUG 19092 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        delivery0_.delivery_id as delivery1_2_0_,
        delivery0_.city as city2_2_0_,
        delivery0_.street as street3_2_0_,
        delivery0_.zipcode as zipcode4_2_0_,
        delivery0_.status as status5_2_0_ 
    from
        delivery delivery0_ 
    where
        delivery0_.delivery_id=?


2022-09-11 16:33:55.820 DEBUG 19092 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        orderitems0_.order_id as order_id5_5_0_,
        orderitems0_.order_item_id as order_it1_5_0_,
        orderitems0_.order_item_id as order_it1_5_1_,
        orderitems0_.count as count2_5_1_,
        orderitems0_.item_id as item_id4_5_1_,
        orderitems0_.order_id as order_id5_5_1_,
        orderitems0_.order_price as order_pr3_5_1_ 
    from
        order_item orderitems0_ 
    where
        orderitems0_.order_id=?


2022-09-11 16:33:55.823 DEBUG 19092 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        item0_.item_id as item_id2_3_0_,
        item0_.dtype as dtype1_3_0_,
        item0_.name as name3_3_0_,
        item0_.price as price4_3_0_,
        item0_.stock_quantity as stock_qu5_3_0_,
        item0_.artist as artist6_3_0_,
        item0_.etc as etc7_3_0_,
        item0_.author as author8_3_0_,
        item0_.isbn as isbn9_3_0_,
        item0_.actor as actor10_3_0_,
        item0_.director as directo11_3_0_ 
    from
        item item0_ 
    where
        item0_.item_id=?


2022-09-11 16:33:55.825 DEBUG 19092 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        delivery0_.delivery_id as delivery1_2_0_,
        delivery0_.city as city2_2_0_,
        delivery0_.street as street3_2_0_,
        delivery0_.zipcode as zipcode4_2_0_,
        delivery0_.status as status5_2_0_ 
    from
        delivery delivery0_ 
    where
        delivery0_.delivery_id=?


2022-09-11 16:33:55.827 DEBUG 19092 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        orderitems0_.order_id as order_id5_5_0_,
        orderitems0_.order_item_id as order_it1_5_0_,
        orderitems0_.order_item_id as order_it1_5_1_,
        orderitems0_.count as count2_5_1_,
        orderitems0_.item_id as item_id4_5_1_,
        orderitems0_.order_id as order_id5_5_1_,
        orderitems0_.order_price as order_pr3_5_1_ 
    from
        order_item orderitems0_ 
    where
        orderitems0_.order_id=?

```

> Order의 결과 수는 3건이지만, 총 10건의 SQL이 실행 된것을 확인 할 수 있습니다.


> 또 이전에 설정이 되어 이번엔 설명을 넘어갔지만 양방향 관계는 꼭 @JsonIgnore를 추가해 그래프 탐색시 무한루프에 빠지는 오류를 조심하기 바랍니다.


### 주문 조회 V2 : DTO 사용

> OrderApiController.java

````
@GetMapping("/api/v2/orders")
    private List<OrderDto> ordersV2(){

        List<Order> orders = orderRepository.findAllByString(new OrderSearch());
        List<OrderDto> collect = orders.stream()
                .map(o-> new OrderDto(o))
                .collect(toList());

        return collect;
    }
````

> java/jpabook/jpashop/dto/OrderDto.java

```
package jpabook.jpashop.dto;

import jdk.vm.ci.meta.Local;
import jpabook.jpashop.domain.*;
import jpabook.jpashop.domain.item.Item;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {

    private long orderId;
    private String name;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private Address address;
    private List<OrderItem> orderItems;

    @JsonIgnore
    private long memberId;
    @JsonIgnore
    private long itemId;
    @JsonIgnore
    private int count;
    @JsonIgnore
    private List<OrderDto> orderDtoList;

    public OrderDto(Order order) {
        this.orderId = order.getId();
        this.name = order.getMember().getName();
        this.orderDate = order.getOrderDate();
        this.orderStatus = order.getStatus();
        this.address = order.getDelivery().getAddress();
        this.orderItems = order.getOrderItems();
    }
}

```

> api/v2/orders

```
[
    {
        "orderId": 35,
        "name": "회원1",
        "orderDate": "2022-07-30T15:23:25.537696",
        "orderStatus": "CANCEL",
        "address": {
            "city": "도시1",
            "street": "거리1",
            "zipcode": "11111"
        },
        "orderItems": null
    },
    {
        "orderId": 88,
        "name": "회원1",
        "orderDate": "2022-08-01T23:19:02.252476",
        "orderStatus": "ORDER",
        "address": {
            "city": "도시1",
            "street": "거리1",
            "zipcode": "11111"
        },
        "orderItems": null,
        "memberId": 0,
        "itemId": 0,
        "count": 0,
        "orderDtoList": null
    },
    {
        "orderId": 92,
        "name": "회원1",
        "orderDate": "2022-08-02T00:58:44.937685",
        "orderStatus": "CANCEL",
        "address": {
            "city": "도시1",
            "street": "거리1",
            "zipcode": "11111"
        },
        "orderItems": null
    }
]
```

> OrderDto에서 orderItems가 Null로 나오는 것을 확인 할 수 있습니다. <br>
입력받은 Order는 엔티티이기 때문에 Lazy Loading이 적용되어 orderItem를 사용(호출)되어야 값이 채워지게 됩니다.

> OrderDto.java - 프록시 초기화

```
    ...
    public OrderDto(Order order) {
        this.orderId = order.getId();
        this.name = order.getMember().getName();
        this.orderDate = order.getOrderDate();
        this.orderStatus = order.getStatus();
        this.address = order.getDelivery().getAddress();
        order.getOrderItems().stream().forEach(o-> o.getItem().getName());
        this.orderItems = order.getOrderItems();
    }
    ...
```

> api/v2/orders - 프록시 초기화

```
[
    {
        "orderId": 35,
        "name": "회원1",
        "orderDate": "2022-07-30T15:23:25.537696",
        "orderStatus": "CANCEL",
        "address": {
            "city": "도시1",
            "street": "거리1",
            "zipcode": "11111"
        },
        "orderItems": [
            {
                "id": 37,
                "item": {
                    "id": 1,
                    "name": "앨범1",
                    "price": 10000,
                    "stockQuantity": 18,
                    "dtype": "A",
                    "categories": null,
                    "artist": "아티스트1",
                    "etc": "기타1",
                    "dtypeNm": "음반"
                },
                "orderPrice": 10000,
                "count": 2,
                "totalPrice": 20000
            }
        ]
    },
    {
        "orderId": 88,
        "name": "회원1",
        "orderDate": "2022-08-01T23:19:02.252476",
        "orderStatus": "ORDER",
        "address": {
            "city": "도시1",
            "street": "거리1",
            "zipcode": "11111"
        },
        "orderItems": [
            {
                "id": 90,
                "item": {
                    "id": 1,
                    "name": "앨범1",
                    "price": 10000,
                    "stockQuantity": 18,
                    "dtype": "A",
                    "categories": null,
                    "artist": "아티스트1",
                    "etc": "기타1",
                    "dtypeNm": "음반"
                },
                "orderPrice": 10000,
                "count": 2,
                "totalPrice": 20000
            },
            {
                "id": 91,
                "item": {
                    "id": 2,
                    "name": "책1",
                    "price": 211,
                    "stockQuantity": 2108,
                    "dtype": "B",
                    "categories": null,
                    "author": "저자1",
                    "isbn": "ISBN1",
                    "dtypeNm": "책"
                },
                "orderPrice": 211,
                "count": 3,
                "totalPrice": 633
            }
        ]
    },
    {
        "orderId": 92,
        "name": "회원1",
        "orderDate": "2022-08-02T00:58:44.937685",
        "orderStatus": "CANCEL",
        "address": {
            "city": "도시1",
            "street": "거리1",
            "zipcode": "11111"
        },
        "orderItems": [
            {
                "id": 94,
                "item": {
                    "id": 1,
                    "name": "앨범1",
                    "price": 10000,
                    "stockQuantity": 18,
                    "dtype": "A",
                    "categories": null,
                    "artist": "아티스트1",
                    "etc": "기타1",
                    "dtypeNm": "음반"
                },
                "orderPrice": 10000,
                "count": 2,
                "totalPrice": 20000
            },
            {
                "id": 95,
                "item": {
                    "id": 1,
                    "name": "앨범1",
                    "price": 10000,
                    "stockQuantity": 18,
                    "dtype": "A",
                    "categories": null,
                    "artist": "아티스트1",
                    "etc": "기타1",
                    "dtypeNm": "음반"
                },
                "orderPrice": 10000,
                "count": 1,
                "totalPrice": 10000
            },
            {
                "id": 96,
                "item": {
                    "id": 2,
                    "name": "책1",
                    "price": 211,
                    "stockQuantity": 2108,
                    "dtype": "B",
                    "categories": null,
                    "author": "저자1",
                    "isbn": "ISBN1",
                    "dtypeNm": "책"
                },
                "orderPrice": 211,
                "count": 1,
                "totalPrice": 211
            }
        ]
    }
]
```

> 프록시 초기화를 통해 OrderItems가 잘 나오는 것을 확인할 수 있습니다. 하지만 OrderItems는 엔티티이기 때문에 이것 또한 직접 사용해 사용 계층에 노출이 되면 안됩니다. 

> <mark>컬렉션인 OrderItem 조차도 DTO로 변환하여 반환하여야 합니다.</mark>

> private List<OrderItem> orderItems; OrderItem 엔티티를 바로 사용 했을 경우 엔티티가 변경 되면 API 스펙이 변하는 심각한 문제가 발생할 수 있습니다.

> OrderDto.java - OrderItemDto 적용

```
package jpabook.jpashop.dto;

import jdk.vm.ci.meta.Local;
import jpabook.jpashop.domain.*;
import jpabook.jpashop.domain.item.Item;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Data
public class OrderDto {

    private long orderId;
    private String name;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;
    private Address address;
    private List<OrderItemDto> orderItems;

    private long memberId;
    private long itemId;

    private int count;
    private List<OrderDto> orderDtoList;

    public OrderDto(Order order) {
        this.orderId = order.getId();
        this.name = order.getMember().getName();
        this.orderDate = order.getOrderDate();
        this.orderStatus = order.getStatus();
        this.address = order.getDelivery().getAddress();
        this.orderItems = order.getOrderItems().stream()
                .map(orderItem-> new OrderItemDto(orderItem))
                .collect(toList());
    }
}

```

> /api/v2/orders - OrderItemDto 적용

```
[
    {
        "orderId": 35,
        "name": "회원1",
        "orderDate": "2022-07-30T15:23:25.537696",
        "orderStatus": "CANCEL",
        "address": {
            "city": "도시1",
            "street": "거리1",
            "zipcode": "11111"
        },
        "orderItems": [
            {
                "itemName": "앨범1",
                "orderPrice": 10000,
                "count": 2
            }
        ]
    },
    {
        "orderId": 88,
        "name": "회원1",
        "orderDate": "2022-08-01T23:19:02.252476",
        "orderStatus": "ORDER",
        "address": {
            "city": "도시1",
            "street": "거리1",
            "zipcode": "11111"
        },
        "orderItems": [
            {
                "itemName": "앨범1",
                "orderPrice": 10000,
                "count": 2
            },
            {
                "itemName": "책1",
                "orderPrice": 211,
                "count": 3
            }
        ]
    },
    {
        "orderId": 92,
        "name": "회원1",
        "orderDate": "2022-08-02T00:58:44.937685",
        "orderStatus": "CANCEL",
        "address": {
            "city": "도시1",
            "street": "거리1",
            "zipcode": "11111"
        },
        "orderItems": [
            {
                "itemName": "앨범1",
                "orderPrice": 10000,
                "count": 2
            },
            {
                "itemName": "앨범1",
                "orderPrice": 10000,
                "count": 1
            },
            {
                "itemName": "책1",
                "orderPrice": 211,
                "count": 1
            }
        ]
    }
]
```

> 엔티티가 아니라 DTO로 반환하라는 것은 단지 겉을 감싸고 있는 엔티티 뿐만아니라 내부의 컬렉션의 엔티티 또한 DTO로 변환하여 반환해줘야 합니다.

```
2022-09-11 19:40:46.980 DEBUG 7068 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        order0_.order_id as order_id1_6_,
        order0_.delivery_id as delivery4_6_,
        order0_.member_id as member_i5_6_,
        order0_.order_date as order_da2_6_,
        order0_.status as status3_6_ 
    from
        orders order0_ 
    left outer join
        member member1_ 
            on order0_.member_id=member1_.member_id limit ?
            
            
2022-09-11 19:40:46.990 DEBUG 7068 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        member0_.member_id as member_i1_4_0_,
        member0_.city as city2_4_0_,
        member0_.street as street3_4_0_,
        member0_.zipcode as zipcode4_4_0_,
        member0_.name as name5_4_0_ 
    from
        member member0_ 
    where
        member0_.member_id=?
        
        
2022-09-11 19:40:46.993 DEBUG 7068 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        delivery0_.delivery_id as delivery1_2_0_,
        delivery0_.city as city2_2_0_,
        delivery0_.street as street3_2_0_,
        delivery0_.zipcode as zipcode4_2_0_,
        delivery0_.status as status5_2_0_ 
    from
        delivery delivery0_ 
    where
        delivery0_.delivery_id=?
        
        
2022-09-11 19:40:46.999 DEBUG 7068 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        orderitems0_.order_id as order_id5_5_0_,
        orderitems0_.order_item_id as order_it1_5_0_,
        orderitems0_.order_item_id as order_it1_5_1_,
        orderitems0_.count as count2_5_1_,
        orderitems0_.item_id as item_id4_5_1_,
        orderitems0_.order_id as order_id5_5_1_,
        orderitems0_.order_price as order_pr3_5_1_ 
    from
        order_item orderitems0_ 
    where
        orderitems0_.order_id=?
        
        
2022-09-11 19:40:47.004 DEBUG 7068 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        item0_.item_id as item_id2_3_0_,
        item0_.dtype as dtype1_3_0_,
        item0_.name as name3_3_0_,
        item0_.price as price4_3_0_,
        item0_.stock_quantity as stock_qu5_3_0_,
        item0_.artist as artist6_3_0_,
        item0_.etc as etc7_3_0_,
        item0_.author as author8_3_0_,
        item0_.isbn as isbn9_3_0_,
        item0_.actor as actor10_3_0_,
        item0_.director as directo11_3_0_ 
    from
        item item0_ 
    where
        item0_.item_id=?
        
        
2022-09-11 19:40:47.007 DEBUG 7068 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        delivery0_.delivery_id as delivery1_2_0_,
        delivery0_.city as city2_2_0_,
        delivery0_.street as street3_2_0_,
        delivery0_.zipcode as zipcode4_2_0_,
        delivery0_.status as status5_2_0_ 
    from
        delivery delivery0_ 
    where
        delivery0_.delivery_id=?
        
        
2022-09-11 19:40:47.010 DEBUG 7068 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        orderitems0_.order_id as order_id5_5_0_,
        orderitems0_.order_item_id as order_it1_5_0_,
        orderitems0_.order_item_id as order_it1_5_1_,
        orderitems0_.count as count2_5_1_,
        orderitems0_.item_id as item_id4_5_1_,
        orderitems0_.order_id as order_id5_5_1_,
        orderitems0_.order_price as order_pr3_5_1_ 
    from
        order_item orderitems0_ 
    where
        orderitems0_.order_id=?
        
        
2022-09-11 19:40:47.015 DEBUG 7068 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        item0_.item_id as item_id2_3_0_,
        item0_.dtype as dtype1_3_0_,
        item0_.name as name3_3_0_,
        item0_.price as price4_3_0_,
        item0_.stock_quantity as stock_qu5_3_0_,
        item0_.artist as artist6_3_0_,
        item0_.etc as etc7_3_0_,
        item0_.author as author8_3_0_,
        item0_.isbn as isbn9_3_0_,
        item0_.actor as actor10_3_0_,
        item0_.director as directo11_3_0_ 
    from
        item item0_ 
    where
        item0_.item_id=?
        
        
2022-09-11 19:40:47.018 DEBUG 7068 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        delivery0_.delivery_id as delivery1_2_0_,
        delivery0_.city as city2_2_0_,
        delivery0_.street as street3_2_0_,
        delivery0_.zipcode as zipcode4_2_0_,
        delivery0_.status as status5_2_0_ 
    from
        delivery delivery0_ 
    where
        delivery0_.delivery_id=?
        
        
2022-09-11 19:40:47.021 DEBUG 7068 --- [nio-8080-exec-2] org.hibernate.SQL                        : 
    select
        orderitems0_.order_id as order_id5_5_0_,
        orderitems0_.order_item_id as order_it1_5_0_,
        orderitems0_.order_item_id as order_it1_5_1_,
        orderitems0_.count as count2_5_1_,
        orderitems0_.item_id as item_id4_5_1_,
        orderitems0_.order_id as order_id5_5_1_,
        orderitems0_.order_price as order_pr3_5_1_ 
    from
        order_item orderitems0_ 
    where
        orderitems0_.order_id=?
              
```

> 수행된 SQL을 보면 10건이 조회 된 것을 알 수 있습니다. 컬렉션을 사용하게 되면 각각 서브 데이터를 루프를 통해 조회하기 때문입니다. 그러기 때문에 컬렉션을 사용할 때에는 좀더 최적화에 신경을 써야합니다.



### 이전 소스
---------------------
> - <a href="https://github.com/offetuoso/jpa-practice.git">https://github.com/offetuoso/jpa-practice.git<a>

#### 참고 
> - <a href="https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8-JPA-API%EA%B0%9C%EB%B0%9C-%EC%84%B1%EB%8A%A5%EC%B5%9C%EC%A0%81%ED%99%94">실전! 스프링 부트와 JPA 활용2 - API 개발과 성능 최적화 - 김영한</a>
