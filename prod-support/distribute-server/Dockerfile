FROM python:3.8-slim

# setup working directory
WORKDIR /app

EXPOSE 8001

COPY ["./distribute-server/requirements.txt", "./"]
RUN pip install -r requirements.txt

COPY ["./distribute-server/*.py", "./"]

# COPY [".env", "./"]

ENV FLASK_ENV production
ENV MONGO_HOST course-mongodb
ENV MONGO_PORT 27017
ENV MONGO_DBNAME ntuee-course
ENV MONGO_USERNAME eeinfo
ENV MONGO_PASSWORD brmEu8EkRwaudH4J
# startup command
CMD ["python", "server.py"]
