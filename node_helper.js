'use strict';

/* Magic Mirror
 * Module: MMM-Tesla2
 *
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const Bluelinky = require('bluelinky');

module.exports = NodeHelper.create({

	start: function() {
		this.started = false;
		this.config = null;
    this.vehicle_data = null;
  },

  getData: function () {
    var self = this;
    const config = {
      username: this.config.username,
      password: this.config.password,
      region: this.config.region || 'US',
      pin: this.config.pin,
      refreshInterval: this.config.refreshInterval || 1000 * 60 * 60,
      refreshIntervalWhileCharging: this.config.refreshIntervalWhileCharging || 1000 * 60 * 10,
      wakeOnModuleLoad: this.config.wakeOnModuleLoad || false,
      wakeOnRefresh: this.config.wakeOnModuleLoad || false,
    };
    const client = new Bluelinky(config);

    client.on('ready', async (vehicles) => {

      // Check if we should wake the car to refresh the data:
      // This happens when this is the first time after the module started and the config allowes it
      const refresh = this.config.wakeOnRefresh || (!this.started && this.config.wakeOnModuleLoad);

      //Get first vehicle using the VIN id
      const vehicle = client.getVehicle(vehicles[0].vehicleConfig.vin);

      // Get non-parsed bluelinky data
      const vehicleData = await vehicle.status({parsed: false, refresh});

      // Get location
      const location = await vehicle.location();

      const newData = {
        ...vehicleData,
        ...location,
        name: vehicle.vehicleConfig.name + ' (' + vehicle.vehicleConfig.generation + ')',
      };

      self.vehicle_data = newData;
      self.sendSocketNotification("CAR_DATA", newData);

      if (vehicleData.engine.charging) {
        setTimeout(function() { self.getData(); }, this.config.refreshIntervalWhileCharging);
      } else {
        setTimeout(function() { self.getData(); }, this.config.refreshInterval);
      }
    });
  },

	socketNotificationReceived: async function(notification, payload) {
		var self = this;
		if (notification === 'BLUELINKY_CONFIG' && self.started == false) {
			self.config = payload;
			self.sendSocketNotification("STARTED", true);
			self.getData();
			self.started = true;
		} else if (notification == 'REFRESH') {
			self.getData();
		} else if (notification == 'BLUELINKY_CONFIG') {
			self.sendSocketNotification("CAR_DATA", self.vehicle_data);
		}
	}
});
