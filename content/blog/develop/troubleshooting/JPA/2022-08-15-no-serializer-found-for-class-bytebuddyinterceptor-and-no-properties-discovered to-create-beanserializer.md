---
title: "JPA Lazy 로딩 Jackson Serialize 에러 - No serializer found for class / org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor and no properties discovered to create BeanSerializer"
image: "bg-troubleshooting.png"
font_color: "white"
font_size: "28px"
opacity: "0.4"
date: 2022-08-15
slug: "no-serializer-found-for-class"
keywords: ["자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
draft: false
categories: ["Troubleshooting"]
subcategories: ["JPA"]
tags: ["Troubleshooting","자바 ORM 표준 JPA","김영한","JPA","ORM","Java","인프런"]
math: false
toc: true
---

# JPA Lazy 로딩 Jackson Serialize 에러 - No serializer found for class -org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor and no properties discovered to create BeanSerializer
---------------------------------------------------------------------------
> API에서 Jackson을 사용해 Lazy 로딩으로 설정된 다른 엔티티를 Serialize하는 부분에서 오류가 발생


## 오류 
```
{
    "timestamp": "2022-08-15T08:24:46.374+00:00",
    "status": 500,
    "error": "Internal Server Error",
    "trace": "org.springframework.http.converter.HttpMessageConversionException: Type definition error: [simple type, class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor]; nested exception is com.fasterxml.jackson.databind.exc.InvalidDefinitionException: No serializer found for class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor and no properties discovered to create BeanSerializer (to avoid exception, disable SerializationFeature.FAIL_ON_EMPTY_BEANS) (through reference chain: java.util.ArrayList[0]->jpabook.jpashop.domain.Order[\"member\"]->jpabook.jpashop.domain.Member$HibernateProxy$w28vcvob[\"hibernateLazyInitializer\"])\r\n\tat org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter.writeInternal(AbstractJackson2HttpMessageConverter.java:462)\r\n\tat org.springframework.http.converter.AbstractGenericHttpMessageConverter.write(AbstractGenericHttpMessageConverter.java:104)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.AbstractMessageConverterMethodProcessor.writeWithMessageConverters(AbstractMessageConverterMethodProcessor.java:290)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestResponseBodyMethodProcessor.handleReturnValue(RequestResponseBodyMethodProcessor.java:183)\r\n\tat org.springframework.web.method.support.HandlerMethodReturnValueHandlerComposite.handleReturnValue(HandlerMethodReturnValueHandlerComposite.java:78)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:135)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:895)\r\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:808)\r\n\tat org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)\r\n\tat org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1067)\r\n\tat org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:963)\r\n\tat org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1006)\r\n\tat org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:898)\r\n\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:655)\r\n\tat org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:883)\r\n\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:764)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:227)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:53)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)\r\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)\r\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)\r\n\tat org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:197)\r\n\tat org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:97)\r\n\tat org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:541)\r\n\tat org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:135)\r\n\tat org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:92)\r\n\tat org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:78)\r\n\tat org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:360)\r\n\tat org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:399)\r\n\tat org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:65)\r\n\tat org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:889)\r\n\tat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1743)\r\n\tat org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)\r\n\tat org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191)\r\n\tat org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)\r\n\tat org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)\r\n\tat java.base/java.lang.Thread.run(Thread.java:834)\r\nCaused by: com.fasterxml.jackson.databind.exc.InvalidDefinitionException: No serializer found for class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor and no properties discovered to create BeanSerializer (to avoid exception, disable SerializationFeature.FAIL_ON_EMPTY_BEANS) (through reference chain: java.util.ArrayList[0]->jpabook.jpashop.domain.Order[\"member\"]->jpabook.jpashop.domain.Member$HibernateProxy$w28vcvob[\"hibernateLazyInitializer\"])\r\n\tat com.fasterxml.jackson.databind.exc.InvalidDefinitionException.from(InvalidDefinitionException.java:77)\r\n\tat com.fasterxml.jackson.databind.SerializerProvider.reportBadDefinition(SerializerProvider.java:1300)\r\n\tat com.fasterxml.jackson.databind.DatabindContext.reportBadDefinition(DatabindContext.java:400)\r\n\tat com.fasterxml.jackson.databind.ser.impl.UnknownSerializer.failForEmpty(UnknownSerializer.java:46)\r\n\tat com.fasterxml.jackson.databind.ser.impl.UnknownSerializer.serialize(UnknownSerializer.java:29)\r\n\tat com.fasterxml.jackson.databind.ser.BeanPropertyWriter.serializeAsField(BeanPropertyWriter.java:728)\r\n\tat com.fasterxml.jackson.databind.ser.std.BeanSerializerBase.serializeFields(BeanSerializerBase.java:774)\r\n\tat com.fasterxml.jackson.databind.ser.BeanSerializer.serialize(BeanSerializer.java:178)\r\n\tat com.fasterxml.jackson.databind.ser.BeanPropertyWriter.serializeAsField(BeanPropertyWriter.java:728)\r\n\tat com.fasterxml.jackson.databind.ser.std.BeanSerializerBase.serializeFields(BeanSerializerBase.java:774)\r\n\tat com.fasterxml.jackson.databind.ser.BeanSerializer.serialize(BeanSerializer.java:178)\r\n\tat com.fasterxml.jackson.databind.ser.std.CollectionSerializer.serializeContents(CollectionSerializer.java:145)\r\n\tat com.fasterxml.jackson.databind.ser.std.CollectionSerializer.serialize(CollectionSerializer.java:107)\r\n\tat com.fasterxml.jackson.databind.ser.std.CollectionSerializer.serialize(CollectionSerializer.java:25)\r\n\tat com.fasterxml.jackson.databind.ser.DefaultSerializerProvider._serialize(DefaultSerializerProvider.java:480)\r\n\tat com.fasterxml.jackson.databind.ser.DefaultSerializerProvider.serializeValue(DefaultSerializerProvider.java:400)\r\n\tat com.fasterxml.jackson.databind.ObjectWriter$Prefetch.serialize(ObjectWriter.java:1514)\r\n\tat com.fasterxml.jackson.databind.ObjectWriter.writeValue(ObjectWriter.java:1007)\r\n\tat org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter.writeInternal(AbstractJackson2HttpMessageConverter.java:456)\r\n\t... 48 more\r\n",
    "message": "Type definition error: [simple type, class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor]; nested exception is com.fasterxml.jackson.databind.exc.InvalidDefinitionException: No serializer found for class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor and no properties discovered to create BeanSerializer (to avoid exception, disable SerializationFeature.FAIL_ON_EMPTY_BEANS) (through reference chain: java.util.ArrayList[0]->jpabook.jpashop.domain.Order[\"member\"]->jpabook.jpashop.domain.Member$HibernateProxy$w28vcvob[\"hibernateLazyInitializer\"])",
    "path": "/api/v1/simple-orders"
}

...

```

## 원인 
> 1. Order 엔티티와 관계된 Member(ManyToOne), Delivery(OneToOne)이 FetchType.LAZY로 설정되어있음
> 2. Jackson으로 Order 엔티티를 Serialize를 할때, LAZY(LAZY 옵션은 필요할 때 조회) 설정으로 비어있는 객체를 Serialize 하려고 해서 발생되는 문제입니다.


#### 문제가된 소스


> Order.java

```
package jpabook.jpashop.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jpabook.jpashop.domain.item.Item;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
//@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class, property = "id") //직렬화시 중복 생성 막음
@Table(name = "orders")
public class Order {

    //protected Order() {}

    @Id @GeneratedValue
    @Column(name="order_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)  // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
    @JoinColumn(name = "member_id") // Order의 member가 수정되면 Order의 외래키 값이 변경됩니다.
    private Member member;


    // mappedBy 연관관계의 주인인 OrderItem의 order로 매핑 되어있다는 뜻
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();


    // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

    private LocalDateTime orderDate; //주문시간

    @Enumerated(EnumType.STRING) // EnumType.ORDINAL(숫자라 순서바뀌면 큰일)이 기본이지만 무조건 EnumType.STRING(문자 코드)
    private OrderStatus status; // 주문상태 [ORDER, CANCEL]


    //==연관관계 메서드 (양방향 연관관계시 추가)==//
    public void setMember(Member member){
        this.member = member;
        member.getOrders().add(this);
    }

    public void addOrderItem(OrderItem orderItem){
        this.orderItems.add(orderItem);
        orderItem.setOrder(this);
    }

    public void setDelivery(Delivery delivery){
        this.delivery = delivery;
        delivery.setOrder(this);
    }

    //== 생성 메서드==//
    public static Order createOrder(Member member, Delivery delivery, OrderItem... orderItems){ // OrderItem...  여러개를 넘길 수 있음

        Order order = new Order();
        order.setMember(member);
        order.setDelivery(delivery);
        for (OrderItem orderItem : orderItems){


            System.out.println(
                    orderItem
            );
            order.addOrderItem(orderItem);
        }
        order.setStatus(OrderStatus.ORDER);
        order.setOrderDate(LocalDateTime.now());

        return order;
    }

    //==비즈니스 로직==//
    /**
     * 주문 취소
     */
    public void cancel(){
        // 배송이 완료된 주문은 취소가 불가
        if (delivery.getStatus() == DeliveryStatus.COMP){
            throw new IllegalStateException("이미 배송이 완료된 상품은 취소가 불가능합니다.");
        }

        this.setStatus(OrderStatus.CANCEL);

        for (OrderItem orderItem : this.orderItems){
            orderItem.cancel();
        }
    }


    //==조회 로직==//
    /**
     * 전체 주문 가격 조회
     */
    public int getTotalPrice(){

        /*
        int totalPrice = 0;

        for (OrderItem orderItem : this.orderItems) {
            totalPrice += orderItem.getTotalPrice();
        }

        return totalPrice;
        */


        return this.orderItems.stream()
                .mapToInt(OrderItem::getTotalPrice)
                .sum();
    }
}

```


## 해결책

### 1. DTO로 바꾸어 사용할 데이터만 반환하여 사용
> 엔티티를 사용하지 않고, DTO로 Order 값만 조회하여 반환

### 2. hibernate5 :  Jackson을 위한 새로운 Hibernate 모듈을 위한 빈을 생성

> Hibernate 객체를 처리할 수 있도록 JSON 직렬화를 사용자 정의하는 것입니다. <br>
Jackson 라이브러리 제공자 FasterXML에서 위 문제를 해결하기 위해 <br>
 ObjectMapper 객체에서 사용할 수 있는 Hibernate용 특정 모듈 jackson-datatype-hibernate 를 제공합니다.
 
> build.gradle

```
	implementation group: 'com.fasterxml.jackson.datatype', name: 'jackson-datatype-hibernate5'

```

> JpashopApplication - 빈생성

```
package jpabook.jpashop;

import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class JpashopApplication {

	public static void main(String[] args) {
		SpringApplication.run(JpashopApplication.class, args);
		Hello hello = new Hello();
	}

	// 빈생성
	@Bean
		Hibernate5Module hibernate5Module(){
		return new Hibernate5Module();
	}
}

```

### 3. yml spring.jackson.serialization.fail-on-empty-beans 값 false 
> 또 다른 방법으로는 비어있는 객체를 Serialize 할때 실패 시 결과에 포함시키지 않아 오류를 회피하는 방법입니다.

```
  jackson:
    serialization:
      fail-on-empty-beans: false
```

### 4. 오류가 나는 컬럼에 @JsonIgnore를 설정해주기
```
    @ManyToOne(fetch = FetchType.LAZY)  // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
    @JoinColumn(name = "member_id") // Order의 member가 수정되면 Order의 외래키 값이 변경됩니다.
    private Member member;
```

> Order.java

```
...

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)  // ToOne은 fetch = FetchType.LAZY로 꼭 !!! 세팅
    @JoinColumn(name = "member_id") // Order의 member가 수정되면 Order의 외래키 값이 변경됩니다.
    private Member member;

...

    @JsonIgnore
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();

...

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

...
```

### 5. LAZY를 EAGER로 변경
> 이러한 방법도 있다지만, 이 문제를 해결하기 위해 LAZY에서 EAGER로 변경하는 것은 좋은 방법은 아닌것 같습니다. 



### 참조

<a href="https://stackoverflow.com/questions/52656517/no-serializer-found-for-class-org-hibernate-proxy-pojo-bytebuddy-bytebuddyinterc">No serializer found for class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor
</a>
