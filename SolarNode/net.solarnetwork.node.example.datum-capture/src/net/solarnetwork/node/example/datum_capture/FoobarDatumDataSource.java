/* ==================================================================
 * FoobarDatumDataSource.java - 16/08/2016 11:21:55 AM
 * 
 * Copyright 2007-2016 SolarNetwork.net Dev Team
 * 
 * This program is free software; you can redistribute it and/or 
 * modify it under the terms of the GNU General Public License as 
 * published by the Free Software Foundation; either version 2 of 
 * the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, 
 * but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
 * General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License 
 * along with this program; if not, write to the Free Software 
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 
 * 02111-1307 USA
 * ==================================================================
 */

package net.solarnetwork.node.example.datum_capture;

import java.util.Date;
import java.util.concurrent.atomic.AtomicLong;
import net.solarnetwork.node.DatumDataSource;
import net.solarnetwork.node.domain.GeneralNodePVEnergyDatum;

/**
 * Implementation of {@link DatumDataSource} for Foobar inverter power.
 * 
 * @author matt
 * @version 1.0
 */
public class FoobarDatumDataSource implements DatumDataSource<GeneralNodePVEnergyDatum> {

	private final AtomicLong wattHourReading = new AtomicLong(0);

	private String sourceId = "Inverter1";

	@Override
	public String getUID() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getGroupUID() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Class<? extends GeneralNodePVEnergyDatum> getDatumType() {
		return GeneralNodePVEnergyDatum.class;
	}

	@Override
	public GeneralNodePVEnergyDatum readCurrentDatum() {
		// our inverter is a 1kW system, let's produce a random value between 0-1000
		int watts = (int) Math.round(Math.random() * 1000.0);

		// we'll increment our Wh reading by a random amount between 0-15, with
		// the assumption we will read samples once per minute
		long wattHours = wattHourReading.addAndGet(Math.round(Math.random() * 15.0));

		GeneralNodePVEnergyDatum datum = new GeneralNodePVEnergyDatum();
		datum.setCreated(new Date());
		datum.setWatts(watts);
		datum.setWattHourReading(wattHours);
		datum.setSourceId(sourceId);
		return datum;
	}

	public void setSourceId(String sourceId) {
		this.sourceId = sourceId;
	}

}
