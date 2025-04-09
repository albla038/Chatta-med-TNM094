import logging
import sys

# Get logger
logger = logging.getLogger("app")

# Create formatter
formatter = logging.Formatter(
  fmt="%(asctime)s - %(levelname)s - %(message)s",
)

# Create handlers
# The stream handler will log to the console, and the file handler will log to a file
# The file handler will append to the file if it exists, and create it if it doesn't
stream_handler = logging.StreamHandler(sys.stdout)
file_handler = logging.FileHandler("app.log")

# Set formatter
stream_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

# Add handlers to the logger
logger.handlers = [stream_handler, file_handler]

# Set log-level
logger.setLevel(logging.INFO)

# Prevent propagation to the root logger
logger.propagate = False