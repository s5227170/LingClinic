<h1>Context</h1>

React-based application for a clinic management web service. It's meant to provide a way for clients of a potential clinic to book appointments and manage their healthcare. Currently, it is under development. However, Some basic functionalities have been completed. Many features will change and improve. The author of the project is utilising this client-side part of the whole software to showcase their front-end abilities and skill. Since focus was on functionality, UI and UX have beeen ignored. Near-future updates will include UI and UX enhancements. The application has been developed in a period of around 1-2 months(together with the server-side).

The server meant to handle the back-end logic for the software is based on Google Cloud Functions and is created utilising node.js/express.js. The Github repository could be found here: 
https://github.com/s5227170/LingClinic-CF

## Installation Guide
To install the client-side software locally:
- Download the newest version of Node.js and install it
- Extract the zip file
- Open the FYP-final folder with Visual Studio Code
- Open the VSC terminal through View → Terminal
- Type npm install to install all dependencies
- After package installation, VSC may still show imports as errors, in case of this, just restart 
VSC to refresh it
- Create a file index.ts in the firebase folder (Figure A1)
- Go to Firebase and copy the firebase config details, then paste them in the firebase folder 
in index.ts (Figure A2)
- Generate a Google Maps Embed API key (Figure A3)
- Add a Google Maps Embed API key in src\pages\About\About.tsx in the iframe key=<API key>& (Figure A4) 
<br/>

<p align="center">
<img width="660" height="300" src="https://user-images.githubusercontent.com/56725628/172591714-a8aa5a01-fe5a-4c8b-a91d-bcdd95b701f8.png">
<h4 align="center">Figure 1: Visualisation of how the file should look</h4>
</p>
<hr>
<p align="center">
<img width="660" height="300" src="https://user-images.githubusercontent.com/56725628/172599647-d389c3f5-7d48-4bb4-a520-4214a898bccd.PNG">
<h4 align="center">Figure 2: The config details could be found in firebase project settings</h4>
</p>
<hr>
<p align="center">
<img width="660" height="300" src="https://user-images.githubusercontent.com/56725628/172599851-be3d379d-5383-4a07-af74-27ee49700a90.PNG">
<h4 align="center">Figure 3: Generation of a Google Maps Embed API key</h4>
</p>
<hr>
<p align="center">
<img width="800" height="200" src="https://user-images.githubusercontent.com/56725628/172600033-2ca198ea-4f92-4d78-9639-b8ec6ee8559c.PNG">
<h4 align="center">Figure 4: Location and target for the Google Maps Embed API key</h4>
</p>
