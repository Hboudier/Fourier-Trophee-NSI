import cv2
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
