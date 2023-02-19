from matplotlib import pyplot as plt
import matplotlib.image as mpimg
import numpy as np
from scipy import ndimage
import math

img = mpimg.imread('Pikachu.jpg')

def grayscale(img):
    R, G, B = img[:,:,0], img [:,:,1], img[:,:,2]
    imgGray = 0.2989 * R  + 0.5870 * G + 0.1140 * B
    return imgGray

def kernel(size, sigma=1):
  size = int(size) // 2
  x, y = np.mgrid[-size:size+1, -size:size+1]
  normal = 1 / (2 * np.pi * sigma**2)
  g= np.exp(-((x**2 + y**2) / (2 * sigma**2))) * normal
  return g 


def gaussian(imgGray, kernel):
    return np.convolve(imgGray, kernel, mode='same')

def sobel_filters(img):
  Kx = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], np.float32)
  Ky = np.array([[1, 2, 1], [0, 0, 0], [-1, -2, -1]], np.float32)
    
  Ix = ndimage.convolve(img, Kx)
  Iy = ndimage.convolve(img, Ky)
      
  G = np.hypot(Ix, Iy)
  G = G / G.max() * 255
  theta = np.arctan2(Iy, Ix)  
  return (G, theta)

def non_max_suppression(img, D):
    M, N = img.shape
    Z = np.zeros((M,N), dtype=np.int32)
    angle = D * 180. / np.pi
    angle[angle < 0] += 180

    for i in range(1,M-1):
        for j in range(1,N-1):
            try:
                q = 255
                r = 255
                
               #angle 0
                if (0 <= angle[i,j] < 22.5) or (157.5 <= angle[i,j] <= 180):
                    q = img[i, j+1]
                    r = img[i, j-1]
                #angle 45
                elif (22.5 <= angle[i,j] < 67.5):
                    q = img[i+1, j-1]
                    r = img[i-1, j+1]
                #angle 90
                elif (67.5 <= angle[i,j] < 112.5):
                    q = img[i+1, j]
                    r = img[i-1, j]
                #angle 135
                elif (112.5 <= angle[i,j] < 157.5):
                    q = img[i-1, j-1]
                    r = img[i+1, j+1]

                if (img[i,j] >= q) and (img[i,j] >= r):
                    Z[i,j] = img[i,j]
                else:
                    Z[i,j] = 0

            except IndexError as e:
                pass
    
    return Z

def threshold(img, lowThresholdRatio=0.05, highThresholdRatio=0.09):
    
    highThreshold = img.max() * highThresholdRatio;
    lowThreshold = highThreshold * lowThresholdRatio;
    
    M, N = img.shape
    res = np.zeros((M,N), dtype=np.int32)
    
    weak = np.int32(25)
    strong = np.int32(255)
    
    strong_i, strong_j = np.where(img >= highThreshold)
    zeros_i, zeros_j = np.where(img < lowThreshold)
    
    weak_i, weak_j = np.where((img <= highThreshold) & (img >= lowThreshold))
    
    res[strong_i, strong_j] = strong
    res[weak_i, weak_j] = weak
    
    return (res, weak, strong)

def hysteresis(img, weak, strong=255):
    M, N = img.shape  
    for i in range(1, M-1):
        for j in range(1, N-1):
            if (img[i,j] == weak):
                try:
                    if ((img[i+1, j-1] == strong) or (img[i+1, j] == strong) or (img[i+1, j+1] == strong)
                        or (img[i, j-1] == strong) or (img[i, j+1] == strong)
                        or (img[i-1, j-1] == strong) or (img[i-1, j] == strong) or (img[i-1, j+1] == strong)):
                        img[i, j] = strong
                    else:
                        img[i, j] = 0
                except IndexError as e:
                    pass
    return img

def coords(img):
  path = []
  coord = np.nonzero(img)
  for i in range(len(coord[0])):
      path.append((coord[0][i], coord[1][i]))
  return path
# def coords(img):
#   path = ""
#   coord = np.nonzero(img)
#   for i in range(len(coord[0])):
#       path = f"{path}[{coord[0][i]},{coord[1][i]}], "
#   return path

gaus_kernel = kernel(5)
gray_img = grayscale(img)
gaus_img = gaussian(gray_img, gaus_kernel)
G, Theta = np.asarray(sobel_filters(gaus_img))
img5 = non_max_suppression(G, Theta)
res, weak, strong = threshold(img5)
img_fin = hysteresis(res, weak, strong)
points = coords(img_fin)

def list_simple(liste):
  simple = []
  for i in range(len(liste)//10):
      simple.append(liste[i * 10])
  return simple


simple = list_simple(points)

