# Use the official MySQL image as the base image
FROM mysql:8.0

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=skillvista
ENV MYSQL_DATABASE=skillvista_db
ENV MYSQL_USER=skillvista
ENV MYSQL_PASSWORD=skillvista

# When using the `mysql` image, the container initializes the database automatically
# upon startup, using the environment variables specified above.

# Expose the port MySQL uses. It's 3306 by default.
EXPOSE 3306
