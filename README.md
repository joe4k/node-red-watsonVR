This repository includes code and instructions on how to create a Node-RED 
node that leverages Watson's visual recognition.

To run the code locally (DIR is assumed your working directory):

1- Install node-red on your machine

2- Change to your working directory
   cd $DIR

3- Clone github repository 
   git clone github.com/joe4k/node-red-watsonVR.git

4- Link your created watsonVR globally so it is accessible from node-red.
   sudo npm link

  Alternatively, you can copy watsonVR/watsonVR.js and watsonVR/watsonVR.html to your node-red direcotry (by default, it is ~/.node-red)

5- Start node-red
   node-red -v

6- Once node-red starts, review the console for any error messages. If no errors, point your bowrser to http://locahost:1880 and your node-red flow editor pops up in thr browser.
   Note the newly added node (visual-recognition) in your flow editor.

7- Import the flow (vrApp_flow.json) into your flow editor.

8- Edit the vrTest node to add your visual recognition credentials.

9- Edit the specifyClassifiers node to provide your specific classifiers you had trained using Watson Visual Recognition service.

10- Deploy the flow.

11- Point your browser to http://localhost:1880/VRendpoint

12- Provide an image url and hit Analyze
==> This should return the class for that image with confidence score.

