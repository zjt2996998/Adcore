# Use an official Python runtime as a parent image
FROM python:3.12

# Set the working directory in the container
WORKDIR /app

# Set PYTHONPATH environment variable
ENV PYTHONPATH=/app

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install the dependencies globally
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . /app/

# Make the entrypoint script executable
RUN chmod +x /app/entrypoint.sh
RUN chmod +x /app/wait-for-it.sh

# Expose the port that the app runs on
EXPOSE 8000

# Use the entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]

