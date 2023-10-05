# Installation

1. Make sure Docker is installed

2. CD to the directory containing the docker file

3. Run the following command to build the container:

    ``` shell
    docker build -t skillvista_db .
    ```

4. Run the following command to run the server:

    ``` shell
    docker run -d --name skillvista_db -p 3306:3306 skillvista_db
    ```
