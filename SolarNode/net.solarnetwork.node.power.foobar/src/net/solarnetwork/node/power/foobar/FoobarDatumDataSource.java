/* ==================================================================
 * FoobarDatumDataSource.java - Mar 7, 2014 10:10:54 AM
 * 
 * Copyright 2007-2014 SolarNetwork.net Dev Team
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

package net.solarnetwork.node.power.foobar;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import net.solarnetwork.node.DatumDataSource;
import net.solarnetwork.node.power.PowerDatum;
import net.solarnetwork.node.settings.SettingSpecifier;
import net.solarnetwork.node.settings.SettingSpecifierProvider;
import net.solarnetwork.node.settings.support.BasicTextFieldSettingSpecifier;
import org.springframework.context.MessageSource;

/**
 * Implementation of {@link DatumDataSource} for Foobar inverter power.
 * 
 * @author matt
 * @version 1.0
 */
public class FoobarDatumDataSource implements DatumDataSource<PowerDatum>, SettingSpecifierProvider {

	private final AtomicLong wattHourReading = new AtomicLong(0);

	private String sourceId = "Main";

	@Override
	public Class<? extends PowerDatum> getDatumType() {
		return PowerDatum.class;
	}

	@Override
	public PowerDatum readCurrentDatum() {
		// our inverter is a 1kW system, let's produce a random value between 0-1000
		int watts = (int) Math.round(Math.random() * 1000.0);

		// we'll increment our Wh reading by a random amount between 0-15, with
		// the assumption we will read samples once per minute
		long wattHours = wattHourReading.addAndGet(Math.round(Math.random() * 15.0));

		PowerDatum datum = new PowerDatum();
		datum.setCreated(new Date());
		datum.setWatts(watts);
		datum.setWattHourReading(wattHours);
		datum.setSourceId(sourceId);
		return datum;
	}

	public void setSourceId(String sourceId) {
		this.sourceId = sourceId;
	}

	// SettingSpecifierProvider

	@Override
	public String getSettingUID() {
		return "net.solarnetwork.node.power.foobar";
	}

	@Override
	public String getDisplayName() {
		return "Foobar Power";
	}

	@Override
	public MessageSource getMessageSource() {
		return null;
	}

	@Override
	public List<SettingSpecifier> getSettingSpecifiers() {
		FoobarDatumDataSource defaults = new FoobarDatumDataSource();
		List<SettingSpecifier> results = new ArrayList<SettingSpecifier>(1);
		results.add(new BasicTextFieldSettingSpecifier("sourceId", defaults.sourceId));
		return results;
	}

}
