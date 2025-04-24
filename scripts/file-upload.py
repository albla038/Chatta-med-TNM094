import tkinter as tk
from tkinter import filedialog
from pathlib import Path
import requests

def choose_folder():
  root = tk.Tk()
  # root.withdraw() 
  folder_selected = filedialog.askdirectory(title="Select a folder to ingest")
  return Path(folder_selected) if folder_selected else None

def upload_file(url: str, file_path: Path, relative_path: Path):
  with open(file_path, "rb") as f:
    files = {"file": f}

    try:
      res = requests.post(url, files=files, data={"relative_path": str(relative_path)})

      if res.status_code != 200:
        # print("Error:", res.status_code)
        # TODO: Handle non-200 status codes
        return "error", f"Upload failed (Status: {res.status_code})"

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



  # return "ok", "File uploaded successfully"

def main():
  # let user enter API url in the format: http://<your-api-url>/upload
  api_url = input("Enter the API URL (e.g., http://<your-api-url>/upload): ")
  print(f"API URL: {api_url}\n")
  if not api_url:
    print("No API URL provided. Terminating...")
    return
  
  print("Select a folder to ingest files from in the dialog box that appears.\n")
  folder_path = choose_folder()
  if not folder_path:
    print("No folder selected. Terminating...")
    return
  
  print(f"Selected folder: {folder_path}\n")

  all_paths_generator = folder_path.rglob("*")
  all_files = [p for p in all_paths_generator if p.is_file()]

  # Get the number of files in the folder
  num_of_files = len(all_files)

  file_counter = 1
  counter_width = len(str(num_of_files))
  for file_path in all_files:
    if file_path.is_file():
      upload_message = f"Uploading {file_path.name}..."
      # upload_message = f"Uploading {file_path.name}..."
      max_length = 65
      if len(upload_message) > max_length:
        upload_message = upload_message[:max_length-3] + "..."
      formatted_message = f"{upload_message:<{max_length}}"
      counter_str = f"({file_counter:>{counter_width}}/{num_of_files})"
      print(f"{formatted_message} {counter_str}", end=" ")

      relative_path = file_path.relative_to(folder_path)
      status, msg = upload_file(api_url, file_path, relative_path)
      print(f"| {status}: {msg}")
      file_counter += 1

if __name__ == "__main__":
  main()