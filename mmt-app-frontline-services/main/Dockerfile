# Init base image
FROM python:3.8-alpine

# Define the present working directory
WORKDIR /main

# Copy the contents into the working dir
ADD . /main

# run pip install dependencies of the flask app and other required libraries found at requirements.txt
RUN pip install -r requirements.txt

# Expose
EXPOSE 5000

# Export the app
RUN export FLASK_APP=wsgi.py

# Define the command to run the container
# CMD [ "gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app" ]
CMD [ "flask", "run" ]