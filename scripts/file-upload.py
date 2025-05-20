import tkinter as tk
from tkinter import filedialog
from pathlib import Path
from datetime import datetime
import requests

def choose_folder():
  root = tk.Tk()
  # root.withdraw() 
  folder_selected = filedialog.askdirectory(title="Select a folder to ingest")
  return Path(folder_selected) if folder_selected else None

def upload_file(
    url: str,
    api_key: str,
    file_path: Path,
    namespace: str,
    relative_path: Path,
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
    ):
  with open(file_path, "rb") as f:
    files = {"file": f}

    try:
      res = requests.post(
        f"{url}/upload/file",
        headers={"x-api-key": api_key},
        files=files,
        params={
          "namespace": namespace,
          "chunk_size": chunk_size,
          "chunk_overlap": chunk_overlap
          },
        data={"relative_path": str(relative_path)}
      )

      # Check if the response status code is 200 (OK)
      if res.status_code != 200:
        return "error", f"Upload failed (Status: {res.status_code}, {res.reason})"

      try:
        res_data = res.json()
        status = res_data.get("status")
        message = res_data.get("message")
        return status, message

      except requests.exceptions.JSONDecodeError:
        # If response is not JSON, return the raw text
        return "ok", f"Upload successful (Status: {res.status_code})"

    except requests.exceptions.HTTPError as e:
      # print("HTTP error:", e)
      return "error", f"HTTP error: {e}"
    
    except Exception as e:
      return "error", f"An unknown error occurred: {e}"

def delete_db(api_url):
  delete_db_url = f"{api_url}/delete/namespace"
  try:
    res = requests.post(delete_db_url)
    if res.status_code == 200:
      print("Database deleted successfully.\n")
    else:
      print(f"Failed to delete database. Status code: {res.status_code}\n")
  except requests.exceptions.RequestException as e:
    print(f"Error deleting database: {e}\n")

def main():
  # Ask the user to enter the API url
  api_url = input("Enter the API URL (e.g., http://<your-api-url>): ")
  print(f"Selected API URL: {api_url}\n")
  if not api_url:
    print("No API URL provided. Terminating...")
    return
  
  api_key = input("Enter the API key: ")
  print(f"Selected API key: {api_key}\n")
  if not api_key:
    print("No API key provided. Terminating...")
    return
  
  # Check if the API URL is reachable, and if the API key is valid
  res = requests.get(api_url, headers={"x-api-key": api_key})
  if res.status_code != 200:
    print(f"Failed to connect to the API. Status: {res.status_code}, {res.reason}")
    return

  # Ask the user if they want to delete the existing database
  delete_db_answer = input("Do you want to delete the existing database before uploading? WARNING. This will delete all current data and cannot be undone. (y/n): ")
  if delete_db_answer.lower() == "y":
    delete_db(api_url);
  
  # Ask the user to select namespace
  chosen_namespace = input("\nEnter the namespace (or leave blank for default): ")
  if not chosen_namespace:
    print("Selected namespace: ( default )\n")
    chosen_namespace = None
  else:
    print(f"Selected namespace: {chosen_namespace}\n")

  chunk_size = 1000
  chunk_overlap = 200

  # Ask the user if they want to configure chunk size and overlap
  configure_chunks = input("Do you want to configure chunk size and overlap? (y/n): ")

  if configure_chunks.lower() == "y":
    # Ask the user to configure chunk size and overlap
    chunk_size = input("Enter the chunk size (default is 1000): ")
    chunk_size = int(chunk_size) if chunk_size.isdigit() else 1000
    print(f"Selected chunk size: {chunk_size}\n")

    # Ask the user to configure chunk overlap
    chunk_overlap = input("Enter the chunk overlap (default is 200): ")
    chunk_overlap = int(chunk_overlap) if chunk_overlap.isdigit() else 200

  # Ask the user to select a folder
  print("Select a folder to ingest files from in the dialog box that appears.\n")
  folder_path = choose_folder()
  if not folder_path:
    print("No folder selected. Terminating...")
    return
  print(f"Selected folder: {folder_path}\n")

  print("Initiating file upload...")
  print("This may take a while depending on the number of files and their sizes.\n")

  # Get all files in the folder and its subfolders
  all_paths_generator = folder_path.rglob("*")
  all_files = [p for p in all_paths_generator if p.is_file()]

  # Get the number of files in the folder
  num_of_files = len(all_files)

  # Store sucessful and unssucessful uploads 
  successful_uploads = []
  unsuccessful_uploads = []

  file_counter = 1
  max_length = 65
  counter_width = len(str(num_of_files))
  for file_path in all_files:
    if file_path.is_file():
      upload_message = f"Uploading {file_path.name}..."
      if len(upload_message) > max_length:
        upload_message = upload_message[:max_length-3] + "..."

      formatted_message = f"{upload_message:<{max_length}}"
      counter_str = f"({file_counter:>{counter_width}}/{num_of_files})"
      print(f"{formatted_message} {counter_str}", end=" ")

      relative_path = file_path.relative_to(folder_path)
      status, msg = upload_file(
        url=api_url,
        api_key=api_key,
        file_path=file_path,
        namespace=chosen_namespace,
        relative_path=relative_path,
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
        )
      
      print(f"| {status}: {msg}")

      result = {
        "filename": file_path.name,
        "status": status,
        "message": msg,
        }

      if status == "ok":
        successful_uploads.append(result)
      else:
        unsuccessful_uploads.append(result)

      file_counter += 1

  print("\n\nFile upload completed.")

  if chosen_namespace is None:
    chosen_namespace = "( default )"

  # Get the current date and time
  now = datetime.now()
  current_time = now.strftime("%Y-%m-%d_%H-%M-%S")

  # Create a log file name with the current date and time
  log_file_name = f"file-upload-log_{current_time}.txt"
  print("Writing log file...\n")

  max_length = 50

  with open(log_file_name, "w") as f:

    f.write(f"Namespace: {chosen_namespace}\n")
    f.write(f"Chunk Size: {chunk_size}\n")
    f.write(f"Chunk Overlap: {chunk_overlap}\n\n")

    f.write(f"Successful Uploads: ({len(successful_uploads)}/{num_of_files})\n")
    for index, upload in enumerate(successful_uploads):
      file_number = index + 1
      counter_str = f"({file_number}/{len(successful_uploads)})"
      content = upload["filename"]
      if len(content) > max_length:
        content = content[:max_length-3] + "..."
      formatted_message = f"{content:<{max_length}}"
      f.write(f"{formatted_message} {counter_str} | {upload['status']}: {upload['message']}\n")
    
    f.write(f"\n\nUnsuccessful Uploads: ({len(unsuccessful_uploads)}/{num_of_files})\n")
    for index, upload in enumerate(unsuccessful_uploads):
      file_number = index + 1
      counter_str = f"({file_number}/{len(unsuccessful_uploads)})"
      content = upload["filename"]
      if len(content) > max_length:
        content = content[:max_length-3] + "..."
      formatted_message = f"{content:<{max_length}}"
      f.write(f"{formatted_message} {counter_str} | {upload['status']}: {upload['message']}\n")

if __name__ == "__main__":
  main()