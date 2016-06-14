# ProjectIndyGo
Indianapolis Civic Hack Semifinalist Application

## Install
IndyTransit is installed via PhoneGap Build. If you were provided a link to the .APK, please follow it from an Android Phone, or transfer the .APK to your phone manually. Install the .APK, and launch the App.

We have tested our app on a Nexus 6P running Android Marshmellow, other versions of Phones/Android may or may not work as intended. We did not have a whole lot of time to do indepth testing.

## Live Bus Data
Live Bus Data is parsed from the GTFS Protobuf files we were provided using a java backend, running on a Raspberry Pi. If Bus Data does not appear to be updating, please contact me so that I can check the status of my Raspberry Pi. In the future, I'd like to be able to do the parsing in-app, but I did not have time to write the backend as a Java Plugin for use with PhoneGap. 

The Java Backend source can be found here: https://github.com/dschrag/IndyRTT
The basic idea is every 10 seconds, the jar pulls the protobuf data again, updates the gtfs_data.json file, and then my Pi detects the change, and uploads the file to my Dropbox using a bash script. This was a Hackathon solution, and not viable for production, but I did not have time to figure out the intricacies of PhoneGap plugin development, and the Protobuf format is not parseable in pure Javascript, which is what the rest of the app is written in.
