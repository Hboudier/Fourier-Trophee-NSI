# Import all the dependencies
import cv2
import math
import numpy as np
import tkinter as tk
from tkinter.ttk import Progressbar
from PIL import Image, ImageTk
import threading


# Ce programme contient une application permettant de créer le fichier path.js à partir d'une image
# Pour l'utiliser:
#   - Mettez l'image dans le dossier avec le programme
#   - Lancez le programme 
#   - entrez le nom de l'image
#   - Appuyez sur le bouton et attendez
#  !!! La conversion prend du temps !!!
# Pour réduire le plus possible le temps, choisir des images simples avec peu de formes  


# Define function to scale the image down to 800x600
def scale(img):
    scale_percent = min(800 / img.shape[1], 600 / img.shape[0])
    width = int(img.shape[1] * scale_percent)
    height = int(img.shape[0] * scale_percent)
    dim = (width, height)
    
    # resize image
    resized = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)
    return resized

# Define function to convert image to grayscale
def grayscale(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) 
    return gray

# Define function to extract coordinates of the white pixels in the image
def coords(img):
  path = []
  coord = np.nonzero(img)
  for i in range(len(coord[0])):
      path.append((coord[0][i], coord[1][i]))
  return path

# Define function to calculate the Euclidean distance between two points
def distance(A, B): 
     return math.sqrt((A[0]-B[0])**2 + (A[1]-B[1])**2)

# Define function to return the first element in a collection
def first(collection):
     return next(iter(collection))

# Define function to implement the nearest neighbor algorithm for the traveling salesman problem
def nn_tsp(points):
    start = first(points)
    tour = [start]
    unvisited = set(points - {start})
    while unvisited:
        C = nearest_neighbor(tour[-1], unvisited)
        tour.append(C)
        unvisited.remove(C)
    return tour


# Define function to find the nearest neighboring point to a given point
def nearest_neighbor(A, points):
    return min(points, key=lambda c: distance(c, A))



# Define function to return a string representation of a list of coordinates in JavaScript format
def coords2(img):
    path = "let drawing2 = ["
    for i in range(len(img)-1):
        path = f"{path}[{img[i][1]},{img[i][0]}], "
    path = f"{path}[{img[i][1]},{img[i][0]}]] "
    return path



# Define function which applies all of the above functions on an image to get the path  
def create_path(img_path):
    error = tk.Label(root, text="L'image n'a pas été trouvé")
    error.pack_forget()

    # Show the Progressbar widget and start the animation
    progress.pack()
    progress.start()
    try:
        img = cv2.imread(img_path)
        scaled = scale(img)
        gray = grayscale(scaled)
        # Apply Canny Edge Detection
        edges = cv2.Canny(gray,100,200)
        # Save the output image
        cv2.imwrite('output.jpg', edges)

        points = coords(edges)
        path = nn_tsp(set(points))
        path2 = coords2(path)
        file = open("path.js", "w")
        file.write(path2)

        # Open a new image file
        new_image = Image.open("output.jpg")
        # Convert the PIL image to a Tkinter-compatible format
        new_tk_image = ImageTk.PhotoImage(new_image)
        # Update the Label widget with the new image
        label.configure(image=new_tk_image)
        # Keep a reference to the new image to avoid garbage collection
        label.image = new_tk_image

    except AttributeError: 
        # Create a label to display a prompt
        error = tk.Label(root, text="L'image n'a pas été trouvé")
        error.pack()
    # Hide the Progressbar widget and stop the animation
    progress.stop()
    progress.pack_forget()


# Define function which gets the path of the image
def choose_image():
    img_path = entry.get()
    create_path(img_path)


# Define a function to run the long_running_function() in a separate thread
def run_function_in_thread():
    thread = threading.Thread(target=choose_image)
    thread.start()



# Create a Tkinter window
root = tk.Tk()
root.title("Image to path")

# Create a label to display a prompt
prompt = tk.Label(root, text="Entrez le nom de votre image :")
prompt.pack()

# Create an Entry widget to get user input
entry = tk.Entry(root)
entry.pack()


# Create a button to trigger the input handling function
button = tk.Button(root, text="Submit", command=run_function_in_thread)
button.pack()

# Create a Progressbar widget and hide it initially
progress = Progressbar(root, mode="indeterminate")
progress.pack_forget()

try:
    # Load the image using PIL
    image = Image.open("output.jpg")

    # Convert the PIL image to a Tkinter-compatible format
    tk_image = ImageTk.PhotoImage(image)

    # Create a Tkinter label with the image
    label = tk.Label(image=tk_image)
    label.pack()
except FileNotFoundError: 
    print("file not found")


# Start the Tkinter main loop
root.mainloop()

