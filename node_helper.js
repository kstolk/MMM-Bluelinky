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
		this.drivestate_data = null;
		this.charge_data = null;
		this.vehicle_data = null;
  },

  getData: function () {
    var self = this;
    const config = {
      username: this.config.username,
      password: this.config.password,
      region: this.config.region,
      pin: this.config.pin,
    };
    const client = new Bluelinky(config);

    client.on('ready', async (vehicles) => {
      // Get VIN of the car
      const vehicle = client.getVehicle(vehicles[0].vehicleConfig.vin);
      const vehicleData = await vehicle.status({parsed: false, refresh: false});
      self.vehicle_data = {
        ...vehicleData,
        name: vehicle.vehicleConfig.name + ' (' + vehicle.vehicleConfig.generation + ')',
      };
      self.sendSocketNotification("CAR_DATA", {
        ...vehicleData,
        name: vehicle.vehicleConfig.name + ' (' + vehicle.vehicleConfig.generation + ')',
      });
    });
  },

	socketNotificationReceived: async function(notification, payload) {
		console.log("socketNotificationReceived");
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
