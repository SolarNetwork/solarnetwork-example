/* ==================================================================
 * FoobarDatumDataSourceTests.java - Mar 7, 2014 10:59:23 AM
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

package net.solarnetwork.node.power.foobar.test;

import net.solarnetwork.node.power.PowerDatum;
import net.solarnetwork.node.power.foobar.FoobarDatumDataSource;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Unit tests for the {@link FoobarDatumDataSource} class.
 * 
 * @author matt
 * @version 1.0
 */
public class FoobarDatumDataSourceTests {

	private static final String TEST_SOURCE_ID = "Test";

	private FoobarDatumDataSource service;

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Before
	public void setup() {
		service = new FoobarDatumDataSource();
		service.setSourceId(TEST_SOURCE_ID);
	}

	@Test
	public void readOneDatum() {
		PowerDatum d = service.readCurrentDatum();
		Assert.assertNotNull("Current datum", d);

		// the source ID should be what we configured in setup()
		Assert.assertEquals("Source ID", TEST_SOURCE_ID, d.getSourceId());

		// the watts and watt hours values should not be null, but we don't know
		// exactly what they'll be because they produce random data
		Assert.assertNotNull("Watts", d.getWatts());
		Assert.assertNotNull("Watt hours", d.getWattHourReading());
		Assert.assertTrue("Watt range", d.getWatts() >= 0 && d.getWatts() <= 1000);
		Assert.assertTrue("Watt hour range", d.getWattHourReading() >= 0L
				&& d.getWattHourReading() <= 15L);
	}

	@Test
	public void readSeveralDatum() {
		long lastWattHourReading = 0;
		for ( int i = 0; i < 10; i++ ) {
			PowerDatum d = service.readCurrentDatum();
			Assert.assertNotNull("Current datum", d);
			Assert.assertEquals("Source ID", TEST_SOURCE_ID, d.getSourceId());
			Assert.assertNotNull("Watts", d.getWatts());
			Assert.assertNotNull("Watt hours", d.getWattHourReading());
			Assert.assertTrue("Watt range", d.getWatts() >= 0 && d.getWatts() <= 1000);
			log.debug("Got Wh reading: {}", d.getWattHourReading());
			Assert.assertTrue("Watt hour range",
					d.getWattHourReading() >= lastWattHourReading
							&& d.getWattHourReading() <= lastWattHourReading + 15L);
			lastWattHourReading = d.getWattHourReading();
		}
	}

}
