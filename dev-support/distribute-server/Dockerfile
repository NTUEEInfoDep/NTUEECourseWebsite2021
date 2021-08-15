FROM python:3.8-slim

# setup working directory
WORKDIR /app

EXPOSE 8001

COPY ["./distribute-server/requirements.txt", "./"]
RUN pip install -r requirements.txt

COPY ["./distribute-server/*.py", "./"]

ENV FLASK_ENV development
ENV MONGO_HOST mongodb
# startup command
CMD ["python", "server.py"]
