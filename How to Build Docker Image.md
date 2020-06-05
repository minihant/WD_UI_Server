# How to Build Docker image for Cloud server

1. start "Docker ToolBox"
2. in powershell , run 
    ```java
    $ docker-compose build
    ```
3. check the docker image was build 
    ```java
    $ docker images
    ```
4. start the image
    ```java
    $ docker-compose up
    ```

## Build docker image & push to docker hub
1. will build a image : dp_server:latest    
```java
$ docer-compose build
```
2. will build a image : minihant/dpserver:v2.4 
```java
$ docker tag dp_server:latest minihant/dpserver:v2.4
```

3. push to docker-Hub
```java
$ docker push minihant/dpserver:v2.4
```

4. in remote Cloud server  pull the image
```java
$ docker pull minihant/dpserver:v2.4
```

5. run image in remote cloud-server
```java
$ docker run -it -p 8081:8081 -p 8082:8082 minihant/dpserver:v2.4
or
$ docker run -d -p 8081:8081 -p 8082:8082 minihant/dpserver:v2.4
```