import cv2
import math
import numpy as np


img = cv2.imread("Pikachu.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cv2.imwrite("Gray.jpg", gray)

# Load the input image
img = cv2.imread('Gray.jpg',0)

# Apply Canny Edge Detection
edges = cv2.Canny(img,100,200,apertureSize=3)

# Save the output image
cv2.imwrite('output2.jpg', edges)

def coords(img):
  path = []
  coord = np.nonzero(img)
  for i in range(len(coord[0])):
      path.append((coord[0][i], coord[1][i]))
  return path

def list_simple(liste):
  simple = []
  for i in range(len(liste)//10):
      simple.append(liste[i * 10])
  return simple

points = coords(edges)
simple = list_simple(points)

def distance(A, B): 
    "The Euclidean distance between two points."
    return math.sqrt((A[0]-B[0])**2 + (A[1]-B[1])**2)

def first(collection):
    "Start iterating over collection, and return the first element."
    return next(iter(collection))

def nn_tsp(cities):
    """Start the tour at the first city; at each step extend the tour 
    by moving from the previous city to the nearest neighboring city, C,
    that has not yet been visited."""
    start = first(cities)
    tour = [start]
    unvisited = set(cities - {start})
    while unvisited:
        C = nearest_neighbor(tour[-1], unvisited)
        tour.append(C)
        unvisited.remove(C)
    return tour

def nearest_neighbor(A, cities):
    "Find the city in cities that is nearest to city A."
    return min(cities, key=lambda c: distance(c, A))


path = nn_tsp(set(points))


def coords2(img):
    path = "let drawing2 = ["
    for i in range(len(img)-1):
        path = f"{path}[{img[i][1]},{img[i][0]}], "
    path = f"{path}[{img[i][1]},{img[i][0]}]] "
    return path

path2 = coords2(path)
file = open("path5.js", "w")
file.write(path2)