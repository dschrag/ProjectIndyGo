/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package project.indigo;

import com.google.protobuf.Descriptors;
    import java.net.URL;

import com.google.transit.realtime.GtfsRealtime.FeedEntity;
import com.google.transit.realtime.GtfsRealtime.FeedMessage;
import java.io.IOException;
import java.net.MalformedURLException;

/**
 *
 * @author Derek
 */
public class ProjectIndigo {
    
    public static String getVehiclePositions() throws MalformedURLException, IOException {
        URL url = new URL("http://66.162.61.195/TMGTFSRealTimeWebService/Vehicle/VehiclePositions.pb");
        FeedMessage feed = FeedMessage.parseFrom(url.openStream());
        String retval = "";
        for (FeedEntity entity : feed.getEntityList()) {
          //  System.out.println(entity);
            //System.out.println(entity.getAllFields());
            //System.out.println(entity.getVehicle());
            retval += entity.getVehicle();
            
        }
        
        return retval;
    }
    
    //http://dev.indygo.net/TMGTFSRealTimeWebService/TripUpdate/TripUpdates.pb
    
    public static String getTripUpdates() throws MalformedURLException, IOException {
        URL url = new URL("http://dev.indygo.net/TMGTFSRealTimeWebService/TripUpdate/TripUpdates.pb");
        FeedMessage feed = FeedMessage.parseFrom(url.openStream());
        String retval = "";
        for (FeedEntity entity : feed.getEntityList()) {
          //  System.out.println(entity);
            //System.out.println(entity.getAllFields());
            //System.out.println(entity.getVehicle());
            retval += entity.getTripUpdate();
            
        }
        
        return retval;
    }

    /**
     * @param args the command line arguments
     * @throws java.net.MalformedURLException
     */
    public static void main(String[] args) throws MalformedURLException, IOException {
        // TODO code application logic here
        System.out.println(getVehiclePositions());
        System.out.println(getTripUpdates());
    }
}
   
    
