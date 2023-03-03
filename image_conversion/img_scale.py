import cv2

img = cv2.imread("Pikachu.jpg")

cv2.imshow("Resized image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()


# scale_percent = img.shape[1] / 800
# width = int(img.shape[1] * scale_percent / 100)
# height = int(img.shape[0] * scale_percent / 100)
# dim = (width, height)
  
# # resize image
# resized = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)
 
# cv2.imwrite('pika.jpg', resized)

# cv2.imshow("Resized image", resized)
# cv2.waitKey(0)
# cv2.destroyAllWindows()