FROM python:3.8-slim-buster

# It will create a folder called app in the container
# and set it as the working directory
WORKDIR /app

# COPY <src> <dest>
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENV DB_USERNAME="postgres"
ENV DB_PASSWORD="123456"

CMD [ "python3", "backend.py"]