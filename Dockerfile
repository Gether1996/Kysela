# Use an official Python runtime as a parent image
FROM python:3.10

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose the port the Django app runs on
EXPOSE 8000

# Run the Django app with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "Roman.wsgi:application"]