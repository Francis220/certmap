import type { Jurisdiction } from "@/lib/types";

type Row = [fips: string, name: string, state: string, system_id: string | null];

const ROWS: Row[] = [
  ["01073", "Jefferson County", "AL", "ess-evs-6-1-1-0"],
  ["01097", "Mobile County", "AL", "ess-evs-6-1-1-0"],
  ["01101", "Montgomery County", "AL", "ess-evs-6-1-1-0"],
  ["01125", "Tuscaloosa County", "AL", "ess-evs-6-1-1-0"],

  ["02020", "Anchorage Municipality", "AK", "dominion-democracy-suite-5-15"],
  ["02090", "Fairbanks North Star", "AK", "dominion-democracy-suite-5-15"],
  ["02110", "Juneau City and Borough", "AK", "dominion-democracy-suite-5-15"],

  ["04013", "Maricopa County", "AZ", "dominion-democracy-suite-5-17"],
  ["04019", "Pima County", "AZ", "dominion-democracy-suite-5-17"],
  ["04021", "Pinal County", "AZ", "dominion-democracy-suite-5-17"],
  ["04025", "Yavapai County", "AZ", "ess-evs-6-1-2-0"],

  ["05119", "Pulaski County", "AR", "ess-evs-6-1-1-0"],
  ["05143", "Washington County", "AR", "ess-evs-6-1-1-0"],
  ["05007", "Benton County", "AR", "ess-evs-6-1-1-0"],

  ["06037", "Los Angeles County", "CA", "dominion-democracy-suite-5-17"],
  ["06073", "San Diego County", "CA", "dominion-democracy-suite-5-17"],
  ["06059", "Orange County", "CA", "hart-verity-2-5"],
  ["06075", "San Francisco County", "CA", "dominion-democracy-suite-5-17"],
  ["06085", "Santa Clara County", "CA", "dominion-democracy-suite-5-15"],

  ["08031", "Denver County", "CO", "dominion-democracy-suite-5-17"],
  ["08005", "Arapahoe County", "CO", "dominion-democracy-suite-5-17"],
  ["08001", "Adams County", "CO", "dominion-democracy-suite-5-17"],
  ["08041", "El Paso County", "CO", "clear-ballot-clearvote-2-3"],

  ["09003", "Hartford County", "CT", "dominion-democracy-suite-5-15"],
  ["09009", "New Haven County", "CT", "dominion-democracy-suite-5-15"],
  ["09001", "Fairfield County", "CT", "dominion-democracy-suite-5-15"],

  ["10003", "New Castle County", "DE", "ess-evs-6-1-1-0"],
  ["10001", "Kent County", "DE", "ess-evs-6-1-1-0"],
  ["10005", "Sussex County", "DE", "ess-evs-6-1-1-0"],

  ["11001", "District of Columbia", "DC", "dominion-democracy-suite-5-13"],

  ["12086", "Miami-Dade County", "FL", "ess-evs-6-1-2-0"],
  ["12011", "Broward County", "FL", "ess-evs-6-1-2-0"],
  ["12099", "Palm Beach County", "FL", "ess-evs-6-1-2-0"],
  ["12095", "Orange County", "FL", "dominion-democracy-suite-5-15"],
  ["12057", "Hillsborough County", "FL", "ess-evs-6-1-2-0"],
  ["12031", "Duval County", "FL", "ess-evs-6-1-2-0"],

  ["13121", "Fulton County", "GA", "dominion-democracy-suite-5-17"],
  ["13089", "DeKalb County", "GA", "dominion-democracy-suite-5-17"],
  ["13135", "Gwinnett County", "GA", "dominion-democracy-suite-5-17"],
  ["13067", "Cobb County", "GA", "dominion-democracy-suite-5-17"],
  ["13063", "Clayton County", "GA", "dominion-democracy-suite-5-17"],

  ["15003", "Honolulu County", "HI", "hart-verity-2-5"],
  ["15009", "Maui County", "HI", "hart-verity-2-5"],
  ["15001", "Hawaii County", "HI", "hart-verity-2-5"],

  ["16001", "Ada County", "ID", "ess-evs-6-0-4-0"],
  ["16027", "Canyon County", "ID", "ess-evs-6-0-4-0"],
  ["16019", "Bonneville County", "ID", "ess-evs-6-0-4-0"],

  ["17031", "Cook County", "IL", "ess-evs-6-1-1-0"],
  ["17043", "DuPage County", "IL", "ess-evs-6-1-1-0"],
  ["17089", "Kane County", "IL", "ess-evs-6-1-1-0"],
  ["17097", "Lake County", "IL", "dominion-democracy-suite-5-15"],

  ["18097", "Marion County", "IN", "microvote-infinity-4-1"],
  ["18089", "Lake County", "IN", "ess-evs-6-1-1-0"],
  ["18057", "Hamilton County", "IN", "microvote-infinity-4-1"],
  ["18141", "St. Joseph County", "IN", "hart-verity-2-4"],

  ["19153", "Polk County", "IA", "hart-verity-2-6"],
  ["19113", "Linn County", "IA", "hart-verity-2-6"],
  ["19163", "Scott County", "IA", "hart-verity-2-6"],
  ["19103", "Johnson County", "IA", "hart-verity-2-6"],

  ["20091", "Johnson County", "KS", "ess-evs-6-1-1-0"],
  ["20173", "Sedgwick County", "KS", "ess-evs-6-1-1-0"],
  ["20177", "Shawnee County", "KS", "ess-evs-6-1-1-0"],

  ["21111", "Jefferson County", "KY", "ess-evs-6-0-4-0"],
  ["21067", "Fayette County", "KY", "ess-evs-6-0-4-0"],
  ["21037", "Campbell County", "KY", "ess-evs-6-0-4-0"],

  ["22033", "East Baton Rouge", "LA", null],
  ["22071", "Orleans Parish", "LA", null],
  ["22051", "Jefferson Parish", "LA", null],

  ["23005", "Cumberland County", "ME", "dominion-democracy-suite-5-5-a"],
  ["23031", "York County", "ME", "dominion-democracy-suite-5-5-a"],
  ["23019", "Penobscot County", "ME", "dominion-democracy-suite-5-5-a"],

  ["24031", "Montgomery County", "MD", "ess-evs-6-1-2-0"],
  ["24033", "Prince George's County", "MD", "ess-evs-6-1-2-0"],
  ["24005", "Baltimore County", "MD", "ess-evs-6-1-2-0"],
  ["24510", "Baltimore City", "MD", "ess-evs-6-1-2-0"],

  ["25025", "Suffolk County", "MA", "ess-evs-5-5-0-0"],
  ["25017", "Middlesex County", "MA", "ess-evs-5-5-0-0"],
  ["25027", "Worcester County", "MA", "ess-evs-5-5-0-0"],

  ["26163", "Wayne County", "MI", "dominion-democracy-suite-5-13"],
  ["26125", "Oakland County", "MI", "ess-evs-6-0-4-0"],
  ["26099", "Macomb County", "MI", "hart-verity-2-4"],
  ["26049", "Genesee County", "MI", "ess-evs-6-0-4-0"],

  ["27053", "Hennepin County", "MN", "ess-evs-6-0-4-0"],
  ["27123", "Ramsey County", "MN", "ess-evs-6-0-4-0"],
  ["27037", "Dakota County", "MN", "ess-evs-6-0-4-0"],

  ["28049", "Hinds County", "MS", "ess-evs-5-5-0-0"],
  ["28033", "DeSoto County", "MS", "ess-evs-5-5-0-0"],
  ["28047", "Harrison County", "MS", "ess-evs-5-5-0-0"],

  ["29189", "St. Louis County", "MO", "ess-evs-6-0-4-0"],
  ["29095", "Jackson County", "MO", "ess-evs-6-0-4-0"],
  ["29077", "Greene County", "MO", "unisyn-openelect-2-1"],

  ["30111", "Yellowstone County", "MT", "ess-evs-5-5-0-0"],
  ["30063", "Missoula County", "MT", "ess-evs-5-5-0-0"],
  ["30031", "Gallatin County", "MT", "ess-evs-5-5-0-0"],

  ["31055", "Douglas County", "NE", "ess-evs-6-1-1-0"],
  ["31109", "Lancaster County", "NE", "ess-evs-6-1-1-0"],
  ["31153", "Sarpy County", "NE", "ess-evs-6-1-1-0"],

  ["32003", "Clark County", "NV", "dominion-democracy-suite-5-17"],
  ["32031", "Washoe County", "NV", "dominion-democracy-suite-5-17"],

  ["33011", "Hillsborough County", "NH", "dominion-democracy-suite-5-5-a"],
  ["33015", "Rockingham County", "NH", "dominion-democracy-suite-5-5-a"],

  ["34003", "Bergen County", "NJ", "dominion-democracy-suite-5-13"],
  ["34013", "Essex County", "NJ", "ess-evs-6-1-1-0"],
  ["34023", "Middlesex County", "NJ", "dominion-democracy-suite-5-13"],

  ["35001", "Bernalillo County", "NM", "dominion-democracy-suite-5-17"],
  ["35049", "Santa Fe County", "NM", "dominion-democracy-suite-5-17"],
  ["35013", "Doña Ana County", "NM", "dominion-democracy-suite-5-17"],

  ["36061", "New York County", "NY", "ess-evs-6-1-1-0"],
  ["36047", "Kings County", "NY", "ess-evs-6-1-1-0"],
  ["36081", "Queens County", "NY", "ess-evs-6-1-1-0"],
  ["36005", "Bronx County", "NY", "ess-evs-6-1-1-0"],
  ["36029", "Erie County", "NY", "dominion-democracy-suite-5-13"],

  ["37119", "Mecklenburg County", "NC", "ess-evs-6-1-2-0"],
  ["37183", "Wake County", "NC", "ess-evs-6-1-2-0"],
  ["37067", "Forsyth County", "NC", "ess-evs-6-1-2-0"],

  ["38017", "Cass County", "ND", "ess-evs-6-0-4-0"],
  ["38035", "Grand Forks", "ND", "ess-evs-6-0-4-0"],

  ["39035", "Cuyahoga County", "OH", "dominion-democracy-suite-5-13"],
  ["39049", "Franklin County", "OH", "ess-evs-6-0-4-0"],
  ["39061", "Hamilton County", "OH", "hart-verity-2-4"],
  ["39153", "Summit County", "OH", "ess-evs-6-0-4-0"],

  ["40109", "Oklahoma County", "OK", "hart-verity-2-4"],
  ["40143", "Tulsa County", "OK", "hart-verity-2-4"],
  ["40027", "Cleveland County", "OK", "hart-verity-2-4"],

  ["41051", "Multnomah County", "OR", "hart-verity-2-3"],
  ["41067", "Washington County", "OR", "hart-verity-2-3"],
  ["41005", "Clackamas County", "OR", "hart-verity-2-3"],

  ["42101", "Philadelphia County", "PA", "ess-evs-6-1-1-0"],
  ["42003", "Allegheny County", "PA", "ess-evs-6-1-1-0"],
  ["42091", "Montgomery County", "PA", "dominion-democracy-suite-5-13"],
  ["42029", "Chester County", "PA", "hart-verity-2-4"],

  ["44007", "Providence County", "RI", "ess-evs-6-0-4-0"],
  ["44003", "Kent County", "RI", "ess-evs-6-0-4-0"],

  ["45045", "Greenville County", "SC", "ess-evs-6-1-1-0"],
  ["45079", "Richland County", "SC", "ess-evs-6-1-1-0"],
  ["45019", "Charleston County", "SC", "ess-evs-6-1-1-0"],

  ["46099", "Minnehaha County", "SD", "ess-evs-5-5-0-0"],
  ["46103", "Pennington County", "SD", "ess-evs-5-5-0-0"],

  ["47157", "Shelby County", "TN", "ess-evs-6-0-4-0"],
  ["47037", "Davidson County", "TN", "dominion-democracy-suite-5-15"],
  ["47065", "Hamilton County", "TN", "ess-evs-6-0-4-0"],
  ["47093", "Knox County", "TN", "microvote-infinity-4-1"],

  ["48201", "Harris County", "TX", "hart-verity-2-5"],
  ["48113", "Dallas County", "TX", "ess-evs-6-1-2-0"],
  ["48439", "Tarrant County", "TX", "hart-verity-2-5"],
  ["48029", "Bexar County", "TX", "ess-evs-6-1-2-0"],
  ["48453", "Travis County", "TX", "hart-verity-2-5"],
  ["48141", "El Paso County", "TX", "dominion-democracy-suite-5-15"],

  ["49035", "Salt Lake County", "UT", "ess-evs-6-1-1-0"],
  ["49049", "Utah County", "UT", "ess-evs-6-1-1-0"],
  ["49011", "Davis County", "UT", "ess-evs-6-1-1-0"],

  ["50007", "Chittenden County", "VT", "dominion-democracy-suite-5-15"],
  ["50025", "Windham County", "VT", "dominion-democracy-suite-5-15"],

  ["51059", "Fairfax County", "VA", "ess-evs-6-1-2-0"],
  ["51760", "Richmond City", "VA", "ess-evs-6-1-2-0"],
  ["51810", "Virginia Beach City", "VA", "ess-evs-6-1-2-0"],
  ["51153", "Prince William County", "VA", "ess-evs-6-1-2-0"],

  ["53033", "King County", "WA", "hart-verity-2-5"],
  ["53053", "Pierce County", "WA", "hart-verity-2-5"],
  ["53061", "Snohomish County", "WA", "hart-verity-2-5"],
  ["53063", "Spokane County", "WA", "clear-ballot-clearvote-2-3"],

  ["54039", "Kanawha County", "WV", "ess-evs-6-0-4-0"],
  ["54003", "Berkeley County", "WV", "ess-evs-6-0-4-0"],

  ["55079", "Milwaukee County", "WI", "ess-evs-6-1-1-0"],
  ["55025", "Dane County", "WI", "ess-evs-6-1-1-0"],
  ["55133", "Waukesha County", "WI", "dominion-democracy-suite-5-13"],

  ["56021", "Laramie County", "WY", null],
  ["56025", "Natrona County", "WY", null],
];

export const JURISDICTIONS: Jurisdiction[] = ROWS.map(([fips, name, state, system_id]) => ({
  fips_code: fips,
  name,
  state,
  system_id,
  system_name_raw: system_id ? null : "State-certified equipment (non-EAC)",
  source: system_id ? "eavs_2024" : "state_certified",
}));
