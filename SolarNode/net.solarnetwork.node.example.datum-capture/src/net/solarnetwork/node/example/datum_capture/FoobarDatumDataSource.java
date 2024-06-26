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

import java.time.Instant;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import net.solarnetwork.domain.datum.DatumSamples;
import net.solarnetwork.node.domain.datum.AcDcEnergyDatum;
import net.solarnetwork.node.domain.datum.SimpleAcDcEnergyDatum;
import net.solarnetwork.node.service.DatumDataSource;
import net.solarnetwork.node.service.support.DatumDataSourceSupport;
import net.solarnetwork.settings.SettingSpecifier;
import net.solarnetwork.settings.SettingSpecifierProvider;
import net.solarnetwork.settings.support.BasicTextFieldSettingSpecifier;

/**
 * Implementation of {@link DatumDataSource} for Foobar inverter power.
 * 
 * @author matt
 * @version 1.0
 */
public class FoobarDatumDataSource extends DatumDataSourceSupport
		implements DatumDataSource, SettingSpecifierProvider {

	/** The {@code sourceId} property default value. */
	public static final String DEFAULT_SOURCE_ID = "Inverter1";

	private final AtomicLong wattHourReading = new AtomicLong(0);

	private String sourceId = DEFAULT_SOURCE_ID;

	/**
	 * Constructor.
	 */
	public FoobarDatumDataSource() {
		super();
		setDisplayName("Foobar Datum Source");
	}

	@Override
	public Class<? extends AcDcEnergyDatum> getDatumType() {
		return SimpleAcDcEnergyDatum.class;
	}

	@Override
	public AcDcEnergyDatum readCurrentDatum() {
		// our inverter is a 1kW system, let's produce a random value between 0-1000
		int watts = (int) Math.round(Math.random() * 1000.0);

		// we will increment our Wh reading by a random amount between 0-15, with
		// the assumption we will read samples once per minute
		long wattHours = wattHourReading.addAndGet(Math.round(Math.random() * 15.0));

		SimpleAcDcEnergyDatum datum = new SimpleAcDcEnergyDatum(sourceId, Instant.now(),
				new DatumSamples());
		datum.setWatts(watts);
		datum.setWattHourReading(wattHours);
		return datum;
	}

	@Override
	public String getSettingUid() {
		return "net.solarnetwork.node.example.datum_capture.foobar";
	}

	@Override
	public List<SettingSpecifier> getSettingSpecifiers() {
		// start with settings for the uid and groupUid properties of our parent class
		List<SettingSpecifier> results = getIdentifiableSettingSpecifiers();

		// add a setting for the sourceId property
		results.add(new BasicTextFieldSettingSpecifier("sourceId", DEFAULT_SOURCE_ID));
		return results;
	}

	/**
	 * Get the source ID.
	 * 
	 * @return the configured source ID
	 */
	public String getSourceId() {
		return sourceId;
	}

	/**
	 * Set the source ID to use.
	 * 
	 * @param sourceId
	 *        the source ID
	 */
	public void setSourceId(String sourceId) {
		this.sourceId = sourceId;
	}

}
