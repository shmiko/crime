QUnit.module('nyc.Geocoder', {
	beforeEach: function(assert){
		setup(assert, this);
		this.GEOCLIENT_OK_ADDRESS_RESPONSE = {"status":"OK","input":"59 maiden ln, manhattan","results":[{"level":"0","status":"EXACT_MATCH","request":"address [houseNumber=59, street=maiden ln, borough=MANHATTAN, zip=null]","response":{"assemblyDistrict":"65","bbl":"1000670001","bblBoroughCode":"1","bblTaxBlock":"00067","bblTaxLot":"0001","boardOfElectionsPreferredLgc":"1","boePreferredStreetName":"MAIDEN LANE","boePreferredstreetCode":"12563001","boroughCode1In":"1","buildingIdentificationNumber":"1079043","businessImprovementDistrict":"113140","censusBlock2000":"2008","censusBlock2010":"1006","censusTract1990":"  1502","censusTract2000":"  1502","censusTract2010":"  1502","cityCouncilDistrict":"01","civilCourtDistrict":"01","coincidentSegmentCount":"1","communityDistrict":"101","communityDistrictBoroughCode":"1","communityDistrictNumber":"01","communitySchoolDistrict":"02","condominiumBillingBbl":"0000000000","congressionalDistrict":"10","cooperativeIdNumber":"0000","cornerCode":"CR","crossStreetNamesFlagIn":"E","dcpCommercialStudyArea":"11004","dcpPreferredLgc":"01","dotStreetLightContractorArea":"1","dynamicBlock":"206","electionDistrict":"010","fireBattalion":"01","fireCompanyNumber":"004","fireCompanyType":"E","fireDivision":"01","firstBoroughName":"MANHATTAN","firstStreetCode":"12563001010","firstStreetNameNormalized":"MAIDEN LANE","fromLionNodeId":"0015262","fromPreferredLgcsFirstSetOf5":"01","genericId":"0000631","geosupportFunctionCode":"1B","geosupportReturnCode":"00","geosupportReturnCode2":"00","gi5DigitStreetCode1":"25630","gi5DigitStreetCode2":"45440","gi5DigitStreetCode3":"45440","gi5DigitStreetCode4":"24050","giBoroughCode1":"1","giBoroughCode2":"1","giBoroughCode3":"1","giBoroughCode4":"1","giBuildingIdentificationNumber1":"1079043","giBuildingIdentificationNumber2":"1079043","giBuildingIdentificationNumber3":"1079043","giBuildingIdentificationNumber4":"1079043","giDcpPreferredLgc1":"01","giDcpPreferredLgc2":"01","giDcpPreferredLgc3":"01","giDcpPreferredLgc4":"01","giHighHouseNumber1":"65","giHighHouseNumber2":"99","giHighHouseNumber3":"105","giHighHouseNumber4":"68","giLowHouseNumber1":"41","giLowHouseNumber2":"85","giLowHouseNumber3":"101","giLowHouseNumber4":"50","giSideOfStreetIndicator1":"L","giSideOfStreetIndicator2":"L","giSideOfStreetIndicator3":"L","giSideOfStreetIndicator4":"R","giStreetCode1":"12563001","giStreetCode2":"14544001","giStreetCode3":"14544001","giStreetCode4":"12405001","giStreetName1":"MAIDEN LANE","giStreetName2":"WILLIAM STREET","giStreetName3":"WILLIAM STREET","giStreetName4":"JOHN STREET","healthArea":"7700","healthCenterDistrict":"15","highBblOfThisBuildingsCondominiumUnits":"1000670001","highCrossStreetB5SC1":"145440","highCrossStreetCode1":"14544001","highCrossStreetName1":"WILLIAM STREET","highHouseNumberOfBlockfaceSortFormat":"000065000AA","houseNumber":"59","houseNumberIn":"59","houseNumberSortFormat":"000059000AA","hurricaneEvacuationZone":"5","instructionalRegion":"MS","interimAssistanceEligibilityIndicator":"I","internalLabelXCoordinate":"0982037","internalLabelYCoordinate":"0197460","latitude":40.708266006244315,"latitudeInternalLabel":40.7086585249236,"legacySegmentId":"0023213","lionBoroughCode":"1","lionBoroughCodeForVanityAddress":"1","lionFaceCode":"3140","lionFaceCodeForVanityAddress":"3140","lionKey":"1314000030","lionKeyForVanityAddress":"1314000030","lionSequenceNumber":"00030","lionSequenceNumberForVanityAddress":"00030","listOf4Lgcs":"01","longitude":-74.0082309440472,"longitudeInternalLabel":-74.00798211500157,"lowBblOfThisBuildingsCondominiumUnits":"1000670001","lowCrossStreetB5SC1":"127100","lowCrossStreetCode1":"12710001","lowCrossStreetName1":"NASSAU STREET","lowHouseNumberOfBlockfaceSortFormat":"000029000AA","lowHouseNumberOfDefiningAddressRange":"000041000AA","nta":"MN25","ntaName":"Battery Park City-Lower Manhattan","numberOfCrossStreetB5SCsHighAddressEnd":"1","numberOfCrossStreetB5SCsLowAddressEnd":"1","numberOfCrossStreetsHighAddressEnd":"1","numberOfCrossStreetsLowAddressEnd":"1","numberOfEntriesInListOfGeographicIdentifiers":"0004","numberOfExistingStructuresOnLot":"0001","numberOfStreetFrontagesOfLot":"03","physicalId":"0000753","policePatrolBoroughCommand":"1","policePrecinct":"001","returnCode1a":"00","returnCode1e":"00","roadwayType":"1","rpadBuildingClassificationCode":"O3","rpadSelfCheckCodeForBbl":"7","sanbornBoroughCode":"1","sanbornPageNumber":"011","sanbornVolumeNumber":"01","sanbornVolumeNumberSuffix":"S","sanitationDistrict":"101","sanitationSnowPriorityCode":"P","segmentAzimuth":"302","segmentIdentifier":"0023213","segmentLengthInFeet":"00460","segmentOrientation":"4","segmentTypeCode":"U","sideOfStreetIndicator":"L","sideOfStreetOfVanityAddress":"L","splitLowHouseNumber":"000029000AA","stateSenatorialDistrict":"26","streetName1In":"MAIDEN LN","streetStatus":"2","taxMapNumberSectionAndVolume":"10102","toLionNodeId":"0015337","toPreferredLgcsFirstSetOf5":"01","trafficDirection":"A","underlyingStreetCode":"12563001","uspsPreferredCityName":"NEW YORK","workAreaFormatIndicatorIn":"C","xCoordinate":"0981968","xCoordinateHighAddressEnd":"0982031","xCoordinateLowAddressEnd":"0981785","xCoordinateOfCenterofCurvature":"0000000","yCoordinate":"0197317","yCoordinateHighAddressEnd":"0197212","yCoordinateLowAddressEnd":"0197601","yCoordinateOfCenterofCurvature":"0000000","zipCode":"10038"}}],"parseTree":null,"policy":null};
		this.GEOCLIENT_OK_INTERSECTION_RESPONSE = {"status":"OK","input":"w43 st and 9 ave mn","results":[{"level":"0","status":"EXACT_MATCH","request":"intersection [crossStreetOne=w43 st, crossStreetTwo=9 ave, borough=MANHATTAN, compassDirection=null]","response":{"assemblyDistrict":"75","boroughCode1In":"1","censusTract1990":" 121  ","censusTract2000":" 121  ","censusTract2010":" 121  ","cityCouncilDistrict":"03","civilCourtDistrict":"03","communityDistrict":"104","communityDistrictBoroughCode":"1","communityDistrictNumber":"04","communitySchoolDistrict":"02","congressionalDistrict":"10","crossStreetNamesFlagIn":"E","dcpPreferredLgcForStreet1":"01","dcpPreferredLgcForStreet2":"01","dotStreetLightContractorArea":"1","fireBattalion":"09","fireCompanyNumber":"054","fireCompanyType":"E","fireDivision":"03","firstBoroughName":"MANHATTAN","firstStreetCode":"13463001010","firstStreetNameNormalized":"WEST   43 STREET","geosupportFunctionCode":"2","geosupportReturnCode":"00","healthArea":"4500","healthCenterDistrict":"15","instructionalRegion":"MS","interimAssistanceEligibilityIndicator":"E","intersectingStreet1":"110910","intersectingStreet2":"134630","latitude":40.759104364276126,"lionNodeNumber":"0021355","listOfPairsOfLevelCodes":"MMMM","longitude":-73.992141787218,"numberOfIntersectingStreets":"2","numberOfStreetCodesAndNamesInList":"02","policePatrolBoroughCommand":"1","policePrecinct":"014","sanbornBoroughCode1":"1","sanbornBoroughCode2":"1","sanbornPageNumber1":"041","sanbornPageNumber2":"043","sanbornVolumeNumber1":"05","sanbornVolumeNumber2":"05","sanbornVolumeNumberSuffix1":"N","sanbornVolumeNumberSuffix2":"N","sanitationCollectionSchedulingSectionAndSubsection":"3A","sanitationDistrict":"104","secondStreetCode":"11091001010","secondStreetNameNormalized":"9 AVENUE","stateSenatorialDistrict":"27","streetCode1":"11091001","streetCode2":"13463001","streetName1":"9 AVENUE","streetName1In":"W43 ST","streetName2":"WEST   43 STREET","streetName2In":"9 AVE","workAreaFormatIndicatorIn":"C","xCoordinate":"0986427","yCoordinate":"0215839","zipCode":"10036"}}],"parseTree":null,"policy":null};
		this.GEOCLIENT_OK_BLOCKFACE_RESPONSE = {"status":"OK","input":"w 43 st btwn 9 ave and 10av mn","results":[{"level":"0","status":"EXACT_MATCH","request":"blockface [onStreet=w 43 st, crossStreetOne=9 ave, crossStreetTwo=10av, borough=MANHATTAN]","response":{"boroughCode1In":"1","coincidentSegmentCount":"1","crossStreetNamesFlagIn":"E","dcpPreferredLgcForStreet1":"01","dcpPreferredLgcForStreet2":"01","dcpPreferredLgcForStreet3":"02","dotStreetLightContractorArea":"1","firstBoroughName":"MANHATTAN","firstStreetCode":"13463001010","firstStreetNameNormalized":"WEST   43 STREET","fromLgc1":"01","fromNode":"0021355","fromXCoordinate":"0986427","fromYCoordinate":"0215839","generatedRecordFlag":"B","genericId":"0001495","geosupportFunctionCode":"3","geosupportReturnCode":"00","highCrossStreetB5SC1":"111010","highCrossStreetB5SC2":"100403","leftSegment1990CensusTract":" 121  ","leftSegment2000CensusBlock":"3001","leftSegment2000CensusTract":" 121  ","leftSegment2010CensusBlock":"2000","leftSegment2010CensusTract":" 121  ","leftSegmentAssemblyDistrict":"75","leftSegmentCommunityDistrict":"104","leftSegmentCommunityDistrictBoroughCode":"1","leftSegmentCommunityDistrictNumber":"04","leftSegmentCommunitySchoolDistrict":"02","leftSegmentDynamicBlock":"303","leftSegmentElectionDistrict":"072","leftSegmentFireBattalion":"09","leftSegmentFireCompanyNumber":"054","leftSegmentFireCompanyType":"E","leftSegmentFireDivision":"03","leftSegmentHealthArea":"4500","leftSegmentHealthCenterDistrict":"15","leftSegmentHighHouseNumber":"0000498","leftSegmentInterimAssistanceEligibilityIndicator":"E","leftSegmentLowHouseNumber":"0000400","leftSegmentNta":"MN15","leftSegmentNtaName":"Clinton","leftSegmentPolicePatrolBoroughCommand":"1","leftSegmentPolicePrecinct":"010","leftSegmentZipCode":"10036","legacyId":"0033841","lengthOfSegmentInFeet":"00901","lgc1":"01","lionBoroughCode":"1","lionFaceCode":"4995","lionKey":"1499502052","lionSequenceNumber":"02052","lowCrossStreetB5SC1":"110910","modeSwitchIn":"X","numberOfCrossStreetB5SCsHighAddressEnd":"2","numberOfCrossStreetB5SCsLowAddressEnd":"1","numberOfStreetCodesAndNamesInList":"03","physicalId":"0001714","rightSegment1990CensusTract":" 121  ","rightSegment2000CensusBlock":"3000","rightSegment2000CensusTract":" 121  ","rightSegment2010CensusBlock":"3000","rightSegment2010CensusTract":" 121  ","rightSegmentAssemblyDistrict":"75","rightSegmentCommunityDistrict":"104","rightSegmentCommunityDistrictBoroughCode":"1","rightSegmentCommunityDistrictNumber":"04","rightSegmentCommunitySchoolDistrict":"02","rightSegmentDynamicBlock":"302","rightSegmentElectionDistrict":"070","rightSegmentFireBattalion":"09","rightSegmentFireCompanyNumber":"054","rightSegmentFireCompanyType":"E","rightSegmentFireDivision":"03","rightSegmentHealthArea":"4500","rightSegmentHealthCenterDistrict":"15","rightSegmentHighHouseNumber":"0000499","rightSegmentInterimAssistanceEligibilityIndicator":"E","rightSegmentLowHouseNumber":"0000401","rightSegmentNta":"MN15","rightSegmentNtaName":"Clinton","rightSegmentPolicePatrolBoroughCommand":"1","rightSegmentPolicePrecinct":"018","rightSegmentZipCode":"10036","roadwayType":"1","sanitationSnowPriorityCode":"S","secondStreetCode":"11091001010","secondStreetNameNormalized":"9 AVENUE","segmentAzimuth":"151","segmentIdentifier":"9009479","segmentOrientation":"W","segmentTypeCode":"U","streetCode1":"11091001","streetCode6":"11101002","streetCode7":"10040301","streetName1":"9 AVENUE","streetName1In":"W 43 ST","streetName2In":"9 AVE","streetName3In":"10AV","streetName6":"10 AVENUE","streetName7":"STAN BROOKS WAY","streetStatus":"2","thirdStreetCode":"11101002010","thirdStreetNameNormalized":"10 AVENUE","toLgc1":"02","toNode":"0021304","toXCoordinate":"0985640","toYCoordinate":"0216275","trafficDirection":"W","workAreaFormatIndicatorIn":"C"}}],"parseTree":null,"policy":null};
		this.GEOCLIENT_NOT_OK_RESPONSE = {"status":"OK","input":"2 broadway","results":[{"level":"1","status":"POSSIBLE_MATCH","request":"address [houseNumber=2, street=broadway, borough=MANHATTAN, zip=null]","response":{"alleyCrossStreetsFlag":"X","assemblyDistrict":"65","bbl":"1000110001","bblBoroughCode":"1","bblTaxBlock":"00011","bblTaxLot":"0001","boardOfElectionsPreferredLgc":"1","boePreferredStreetName":"BROADWAY","boePreferredstreetCode":"11361001","boroughCode1In":"1","buildingIdentificationNumber":"1000029","businessImprovementDistrict":"113140","censusBlock2000":"2002","censusBlock2010":"1003","censusTract1990":"   9  ","censusTract2000":"   9  ","censusTract2010":"   9  ","cityCouncilDistrict":"01","civilCourtDistrict":"01","coincidentSegmentCount":"2","communityDistrict":"101","communityDistrictBoroughCode":"1","communityDistrictNumber":"01","communitySchoolDistrict":"02","condominiumBillingBbl":"0000000000","congressionalDistrict":"10","cooperativeIdNumber":"0000","cornerCode":"CR","crossStreetNamesFlagIn":"E","dcpCommercialStudyArea":"11001","dcpPreferredLgc":"01","dotStreetLightContractorArea":"1","dynamicBlock":"213","electionDistrict":"088","fireBattalion":"01","fireCompanyNumber":"015","fireCompanyType":"L","fireDivision":"01","firstBoroughName":"MANHATTAN","firstStreetCode":"11361001010","firstStreetNameNormalized":"BROADWAY","fromLionNodeId":"0015138","fromPreferredLgcsFirstSetOf5":"0101","genericId":"0000428","geosupportFunctionCode":"1B","geosupportReturnCode":"00","geosupportReturnCode2":"00","gi5DigitStreetCode1":"13610","gi5DigitStreetCode2":"25900","gi5DigitStreetCode3":"31610","gi5DigitStreetCode4":"27120","gi5DigitStreetCode5":"12950","gi5DigitStreetCode6":"13590","giBoroughCode1":"1","giBoroughCode2":"1","giBoroughCode3":"1","giBoroughCode4":"1","giBoroughCode5":"1","giBoroughCode6":"1","giBuildingIdentificationNumber1":"1000029","giBuildingIdentificationNumber2":"1000029","giBuildingIdentificationNumber3":"1000029","giBuildingIdentificationNumber4":"1000029","giBuildingIdentificationNumber5":"1000029","giBuildingIdentificationNumber6":"1000029","giDcpPreferredLgc1":"01","giDcpPreferredLgc2":"01","giDcpPreferredLgc3":"01","giDcpPreferredLgc4":"01","giDcpPreferredLgc5":"01","giDcpPreferredLgc6":"01","giGeographicIdentifier4":"W","giHighHouseNumber1":"8","giHighHouseNumber2":"10","giHighHouseNumber3":"9","giHighHouseNumber5":"12","giHighHouseNumber6":"76","giLowHouseNumber1":"2","giLowHouseNumber2":"10","giLowHouseNumber3":"1","giLowHouseNumber5":"2","giLowHouseNumber6":"76","giSideOfStreetIndicator1":"R","giSideOfStreetIndicator2":"L","giSideOfStreetIndicator3":"L","giSideOfStreetIndicator5":"R","giSideOfStreetIndicator6":"R","giStreetCode1":"11361001","giStreetCode2":"12590001","giStreetCode3":"13161001","giStreetCode4":"12712001","giStreetCode5":"11295001","giStreetCode6":"11359001","giStreetName1":"BROADWAY","giStreetName2":"MARKETFIELD STREET","giStreetName3":"STONE STREET","giStreetName4":"NEW STREET","giStreetName5":"BEAVER STREET","giStreetName6":"BROAD STREET","healthArea":"7700","healthCenterDistrict":"15","highBblOfThisBuildingsCondominiumUnits":"1000110001","highCrossStreetB5SC1":"112950","highCrossStreetCode1":"11295001","highCrossStreetName1":"BEAVER STREET","highHouseNumberOfBlockfaceSortFormat":"000008000AA","houseNumber":"2","houseNumberIn":"2","houseNumberSortFormat":"000002000AA","hurricaneEvacuationZone":"1","individualSegmentLength":"00187","instructionalRegion":"MS","interimAssistanceEligibilityIndicator":"I","internalLabelXCoordinate":"0980691","internalLabelYCoordinate":"0195953","latitude":40.70411820664394,"latitudeInternalLabel":40.70452172661063,"legacySegmentId":"0023004","lionBoroughCode":"1","lionBoroughCodeForVanityAddress":"1","lionFaceCode":"0755","lionFaceCodeForVanityAddress":"0755","lionKey":"1075500010","lionKeyForVanityAddress":"1075500010","lionSequenceNumber":"00010","lionSequenceNumberForVanityAddress":"00010","listOf4Lgcs":"01","longitude":-74.01318600313928,"longitudeInternalLabel":-74.01283623337805,"lowBblOfThisBuildingsCondominiumUnits":"1000110001","lowCrossStreetB5SC1":"131610","lowCrossStreetB5SC2":"145340","lowCrossStreetCode1":"13161001","lowCrossStreetCode2":"14534001","lowCrossStreetName1":"STONE STREET","lowCrossStreetName2":"WHITEHALL STREET","lowHouseNumberOfBlockfaceSortFormat":"000002000AA","lowHouseNumberOfDefiningAddressRange":"000002000AA","noCrossStreetCalculationFlag":"Y","nta":"MN25","ntaName":"Battery Park City-Lower Manhattan","numberOfCrossStreetB5SCsHighAddressEnd":"1","numberOfCrossStreetB5SCsLowAddressEnd":"2","numberOfCrossStreetsHighAddressEnd":"1","numberOfCrossStreetsLowAddressEnd":"2","numberOfEntriesInListOfGeographicIdentifiers":"0006","numberOfExistingStructuresOnLot":"0001","numberOfStreetFrontagesOfLot":"06","physicalId":"0000542","policePatrolBoroughCommand":"1","policePrecinct":"001","returnCode1a":"00","returnCode1e":"00","roadwayType":"1","rpadBuildingClassificationCode":"O4","rpadSelfCheckCodeForBbl":"5","sanbornBoroughCode":"1","sanbornPageNumber":"001","sanbornVolumeNumber":"01","sanbornVolumeNumberSuffix":"S","sanitationDistrict":"101","sanitationSnowPriorityCode":"P","segmentAzimuth":"097","segmentIdentifier":"0023004","segmentLengthInFeet":"00362","segmentOrientation":"2","segmentTypeCode":"U","sideOfStreetIndicator":"R","sideOfStreetOfVanityAddress":"R","splitLowHouseNumber":"000002000AA","stateSenatorialDistrict":"26","streetName1In":"BROADWAY","streetStatus":"2","taxMapNumberSectionAndVolume":"10101","toLionNodeId":"0015169","toPreferredLgcsFirstSetOf5":"01","trafficDirection":"A","underlyingStreetCode":"11361001","uspsPreferredCityName":"NEW YORK","workAreaFormatIndicatorIn":"C","xCoordinate":"0980594","xCoordinateHighAddressEnd":"0980571","xCoordinateLowAddressEnd":"0980594","xCoordinateOfCenterofCurvature":"0000000","yCoordinate":"0195806","yCoordinateHighAddressEnd":"0195965","yCoordinateLowAddressEnd":"0195778","yCoordinateOfCenterofCurvature":"0000000","zipCode":"10004"}},{"level":"1","status":"POSSIBLE_MATCH","request":"address [houseNumber=2, street=broadway, borough=QUEENS, zip=null]","response":{"assemblyDistrict":"23","bbl":"4142340553","bblBoroughCode":"4","bblTaxBlock":"14234","bblTaxLot":"0553","boardOfElectionsPreferredLgc":"1","boePreferredStreetName":"BROADWAY","boePreferredstreetCode":"43729001","boroughCode1In":"4","buildingIdentificationNumber":"4435483","censusBlock2000":"4000","censusBlock2010":"6001","censusTract1990":" 884  ","censusTract2000":" 884  ","censusTract2010":" 884  ","cityCouncilDistrict":"32","civilCourtDistrict":"03","coincidentSegmentCount":"1","communityDistrict":"410","communityDistrictBoroughCode":"4","communityDistrictNumber":"10","communitySchoolDistrict":"27","condominiumBillingBbl":"0000000000","congressionalDistrict":"08","continuousParityIndicator1a":"L","continuousParityIndicator1e":"L","cooperativeIdNumber":"0000","crossStreetNamesFlagIn":"E","dcpPreferredLgc":"01","dotStreetLightContractorArea":"4","dynamicBlock":"422","electionDistrict":"050","fireBattalion":"51","fireCompanyNumber":"173","fireCompanyType":"L","fireDivision":"13","firstBoroughName":"QUEENS","firstStreetCode":"43729001010","firstStreetNameNormalized":"BROADWAY","fromLionNodeId":"0033574","fromPreferredLgcsFirstSetOf5":"01","genericId":"0062219","geosupportFunctionCode":"1B","geosupportReturnCode":"01","geosupportReturnCode2":"00","gi5DigitStreetCode1":"37290","gi5DigitStreetCode2":"19540","giBoroughCode1":"4","giBoroughCode2":"4","giBuildingIdentificationNumber1":"4435483","giBuildingIdentificationNumber2":"4435483","giDcpPreferredLgc1":"01","giDcpPreferredLgc2":"01","giHighHouseNumber1":"2","giHighHouseNumber2":"160-02","giLowHouseNumber1":"2","giLowHouseNumber2":"160-02","giSideOfStreetIndicator1":"L","giSideOfStreetIndicator2":"L","giStreetCode1":"43729001","giStreetCode2":"41954001","giStreetName1":"BROADWAY","giStreetName2":"102 STREET","healthArea":"3611","healthCenterDistrict":"45","highBblOfThisBuildingsCondominiumUnits":"4142340553","highCrossStreetB5SC1":"419540","highCrossStreetB5SC2":"436950","highCrossStreetCode1":"41954001","highCrossStreetCode2":"43695001","highCrossStreetName1":"102 STREET","highCrossStreetName2":"BRIDGE STREET","highHouseNumberOfBlockfaceSortFormat":"000010000AA","houseNumber":"2","houseNumberIn":"2","houseNumberSortFormat":"000002000AA","hurricaneEvacuationZone":"1","instructionalRegion":"QS","interimAssistanceEligibilityIndicator":"I","internalLabelXCoordinate":"1031280","internalLabelYCoordinate":"0179178","latitude":40.65819820758061,"latitudeInternalLabel":40.65835398614121,"legacySegmentId":"0115790","lionBoroughCode":"4","lionBoroughCodeForVanityAddress":"4","lionFaceCode":"6142","lionFaceCodeForVanityAddress":"6142","lionKey":"4614206085","lionKeyForVanityAddress":"4614206085","lionSequenceNumber":"06085","lionSequenceNumberForVanityAddress":"06085","listOf4Lgcs":"01","longitude":-73.83095247160807,"longitudeInternalLabel":-73.83049434252868,"lowBblOfThisBuildingsCondominiumUnits":"4142340553","lowCrossStreetB5SC1":"419540","lowCrossStreetCode1":"41954001","lowCrossStreetName1":"102 STREET","lowHouseNumberOfBlockfaceSortFormat":"000002000AA","lowHouseNumberOfDefiningAddressRange":"000002000AA","message":"2 BROADWAY IS ON LEFT SIDE OF 102 STREET","nta":"QN57","ntaName":"Lindenwood-Howard Beach","numberOfCrossStreetB5SCsHighAddressEnd":"2","numberOfCrossStreetB5SCsLowAddressEnd":"1","numberOfCrossStreetsHighAddressEnd":"2","numberOfCrossStreetsLowAddressEnd":"1","numberOfEntriesInListOfGeographicIdentifiers":"0002","numberOfExistingStructuresOnLot":"0001","numberOfStreetFrontagesOfLot":"02","physicalId":"0071602","policePatrolBoroughCommand":"8","policePrecinct":"106","reasonCode":"V","reasonCode1e":"V","returnCode1a":"00","returnCode1e":"01","roadwayType":"1","rpadBuildingClassificationCode":"V0","rpadSelfCheckCodeForBbl":"7","sanbornBoroughCode":"4","sanbornPageNumber":"057","sanbornVolumeNumber":"18","sanitationCollectionSchedulingSectionAndSubsection":"4E","sanitationDistrict":"410","sanitationRecyclingCollectionSchedule":"ES","sanitationRegularCollectionSchedule":"WS","sanitationSnowPriorityCode":"P","segmentAzimuth":"280","segmentIdentifier":"0280149","segmentLengthInFeet":"00130","segmentOrientation":"S","segmentTypeCode":"U","sideOfStreetIndicator":"L","sideOfStreetOfVanityAddress":"L","specialAddressGeneratedRecordFlag":"B","splitLowHouseNumber":"000002000AA","stateSenatorialDistrict":"15","streetName1In":"BROADWAY","streetStatus":"2","taxMapNumberSectionAndVolume":"45805","toLionNodeId":"9039652","toPreferredLgcsFirstSetOf5":"0101","trafficDirection":"T","underlyingStreetCode":"41954001","uspsPreferredCityName":"HOWARD BEACH","workAreaFormatIndicatorIn":"C","xCoordinate":"1031153","xCoordinateHighAddressEnd":"1031171","xCoordinateLowAddressEnd":"1031146","xCoordinateOfCenterofCurvature":"0000000","yCoordinate":"0179121","yCoordinateHighAddressEnd":"0179011","yCoordinateLowAddressEnd":"0179140","yCoordinateOfCenterofCurvature":"0000000","zipCode":"11414"}},{"level":"1","status":"POSSIBLE_MATCH","request":"address [houseNumber=2, street=broadway, borough=STATEN ISLAND, zip=null]","response":{"alleyCrossStreetsFlag":"X","assemblyDistrict":"61","boardOfElectionsPreferredLgc":"1","boePreferredStreetName":"BROADWAY","boePreferredstreetCode":"52045001","boroughCode1In":"5","censusBlock2000":"1000","censusBlock2010":"2002","censusTract1990":" 13302","censusTract2000":" 13302","censusTract2010":" 13302","cityCouncilDistrict":"49","civilCourtDistrict":"01","coincidentSegmentCount":"1","communityDistrict":"501","communityDistrictBoroughCode":"5","communityDistrictNumber":"01","communitySchoolDistrict":"31","congressionalDistrict":"11","crossStreetNamesFlagIn":"E","dcpPreferredLgc":"01","dotStreetLightContractorArea":"5","dynamicBlock":"114","electionDistrict":"016","fireBattalion":"22","fireCompanyNumber":"079","fireCompanyType":"L","fireDivision":"08","firstBoroughName":"STATEN IS","firstStreetCode":"52045001010","firstStreetNameNormalized":"BROADWAY","fromLionNodeId":"0009305","fromPreferredLgcsFirstSetOf5":"01","genericId":"0030506","geosupportFunctionCode":"1B","geosupportReturnCode":"00","geosupportReturnCode2":"42","healthArea":"0300","healthCenterDistrict":"51","highCrossStreetB5SC1":"538307","highCrossStreetCode1":"53830701","highCrossStreetName1":"SKINNER LANE","highHouseNumberOfBlockfaceSortFormat":"000056000AA","houseNumber":"2","houseNumberIn":"2","houseNumberSortFormat":"000002000AA","hurricaneEvacuationZone":"2","individualSegmentLength":"00052","instructionalRegion":"SI","interimAssistanceEligibilityIndicator":"I","latitude":40.64054706182354,"legacySegmentId":"0013567","lionBoroughCode":"5","lionBoroughCodeForVanityAddress":"5","lionFaceCode":"1026","lionFaceCodeForVanityAddress":"1026","lionKey":"5102600041","lionKeyForVanityAddress":"5102600041","lionSequenceNumber":"00041","lionSequenceNumberForVanityAddress":"00041","listOf4Lgcs":"01","longitude":-74.11799529434403,"lowCrossStreetB5SC1":"545050","lowCrossStreetCode1":"54505001","lowCrossStreetName1":"RICHMOND TERRACE","lowHouseNumberOfBlockfaceSortFormat":"000002000AA","message2":"ADDRESS NUMBER OUT OF RANGE","noCrossStreetCalculationFlag":"Y","nta":"SI22","ntaName":"West New Brighton-New Brighton-St. George","numberOfCrossStreetB5SCsHighAddressEnd":"1","numberOfCrossStreetB5SCsLowAddressEnd":"1","numberOfCrossStreetsHighAddressEnd":"1","numberOfCrossStreetsLowAddressEnd":"1","numberOfStreetCodesAndNamesInList":"02","nypdId":"0006890","physicalId":"0035037","policePatrolBoroughCommand":"7","policePrecinct":"120","returnCode1a":"42","returnCode1e":"00","roadwayType":"1","sanitationCollectionSchedulingSectionAndSubsection":"3D","sanitationDistrict":"501","sanitationOrganicsCollectionSchedule":"ET","sanitationRecyclingCollectionSchedule":"ET","sanitationRegularCollectionSchedule":"TF","sanitationSnowPriorityCode":"P","segmentAzimuth":"282","segmentIdentifier":"9007031","segmentLengthInFeet":"00216","segmentOrientation":"4","segmentTypeCode":"U","sideOfStreetIndicator":"R","sideOfStreetOfVanityAddress":"R","splitLowHouseNumber":"000002000AA","stateSenatorialDistrict":"23","streetCode1":"54505001","streetCode6":"53830701","streetName1":"RICHMOND TERRACE","streetName1In":"BROADWAY","streetName6":"SKINNER LANE","streetStatus":"2","toLionNodeId":"9000159","toPreferredLgcsFirstSetOf5":"01","trafficDirection":"T","underlyingStreetCode":"52045001","uspsPreferredCityName":"STATEN ISLAND","workAreaFormatIndicatorIn":"C","xCoordinate":"0951503","xCoordinateHighAddressEnd":"0951515","xCoordinateLowAddressEnd":"0951504","xCoordinateOfCenterofCurvature":"0000000","yCoordinate":"0172667","yCoordinateHighAddressEnd":"0172624","yCoordinateLowAddressEnd":"0172675","yCoordinateOfCenterofCurvature":"0000000","zipCode":"10310"}}],"parseTree":null,"policy":null};	
	},
	afterEach: function(assert){
		teardown(assert, this);
		delete this.GEOCLIENT_OK_ADDRESS_RESPONSE;
		delete this.GEOCLIENT_OK_INTERSECTION_RESPONSE;
		delete this.GEOCLIENT_OK_BLOCKFACE_RESPONSE;
		delete this.GEOCLIENT_NOT_OK_RESPONSE;
	}
});

QUnit.test('project', function(assert){
	assert.expect(2);

	var geocoder = new nyc.Geoclient();
	var coordinates = [981631, 202242];
	assert.deepEqual(geocoder.project(coordinates), coordinates);
	geocoder = new nyc.Geoclient(null, 'EPSG:4326');
	assert.deepEqual(geocoder.project(coordinates), [-74.00944838513226, 40.72178386137363]);
});

QUnit.test('parse (address)', function(assert){
	assert.expect(1);

	var geocoder = new nyc.Geoclient();
	assert.deepEqual(
		geocoder.parse(this.GEOCLIENT_OK_ADDRESS_RESPONSE.results[0]),
		{
			type: nyc.Locate.LocateResultType.GEOCODE,
			coordinates: [982037, 197460],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			name: '59 Maiden Lane, Manhattan, NY 10038',
			data: this.GEOCLIENT_OK_ADDRESS_RESPONSE.results[0].response
		}
	);
});

QUnit.test('parse (intersection)', function(assert){
	assert.expect(1);

	var geocoder = new nyc.Geoclient();
	assert.deepEqual(
		geocoder.parse(this.GEOCLIENT_OK_INTERSECTION_RESPONSE.results[0]),
		{
			type: nyc.Locate.LocateResultType.GEOCODE,
			coordinates: [0986427, 215839],
			accuracy: nyc.Geocoder.Accuracy.MEDIUM,
			name: '9 Avenue And West 43 Street, Manhattan, NY 10036',
			data: this.GEOCLIENT_OK_INTERSECTION_RESPONSE.results[0].response		
		}
	);
});

QUnit.test('parse (blockface)', function(assert){
	assert.expect(1);

	var geocoder = new nyc.Geoclient();
	assert.deepEqual(
		geocoder.parse(this.GEOCLIENT_OK_BLOCKFACE_RESPONSE.results[0]),
		{
			type: nyc.Locate.LocateResultType.GEOCODE,
			coordinates: [986033.5, 216057],
			accuracy: nyc.Geocoder.Accuracy.LOW,
			name: 'West 43 Street Btwn 9 Avenue & 10 Avenue, Manhattan, NY 10036',
			data: this.GEOCLIENT_OK_BLOCKFACE_RESPONSE.results[0].response
		}
	);
});

QUnit.test('possible', function(assert){
	assert.expect(1);

	var geocoder = new nyc.Geoclient();
	assert.deepEqual(
		geocoder.possible(this.GEOCLIENT_NOT_OK_RESPONSE.results),
		[{
			type: nyc.Locate.LocateResultType.GEOCODE,
			coordinates: [980691, 195953],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			name: '2 Broadway, Manhattan, NY 10004',
			data: this.GEOCLIENT_NOT_OK_RESPONSE.results[0].response
		},
		{
			type: nyc.Locate.LocateResultType.GEOCODE,
			coordinates: [1031280, 179178],
			accuracy: nyc.Geocoder.Accuracy.HIGH,
			name: '2 Broadway, Queens, NY 11414',
			data: this.GEOCLIENT_NOT_OK_RESPONSE.results[1].response			
		},
		{
			type: nyc.Locate.LocateResultType.GEOCODE,
			coordinates: [951503, 172667],
			accuracy: nyc.Geocoder.Accuracy.MEDIUM,
			name: '2 Broadway, Staten Is, NY 10310',
			data: this.GEOCLIENT_NOT_OK_RESPONSE.results[2].response
		}]
	);
});

QUnit.test('geoclient (geocoded)', function(assert){
	assert.expect(1);

	var me = this, geocoder = new nyc.Geoclient();
	geocoder.on(nyc.Locate.LocateEventType.GEOCODE, function(data){
		assert.deepEqual(
			data,
			{
				type: nyc.Locate.LocateResultType.GEOCODE,
				coordinates: [982037, 197460],
				accuracy: nyc.Geocoder.Accuracy.HIGH,
				name: '59 Maiden Lane, Manhattan, NY 10038',
				data: me.GEOCLIENT_OK_ADDRESS_RESPONSE.results[0].response
			}
		);
	});
	geocoder.geoclient(me.GEOCLIENT_OK_ADDRESS_RESPONSE)
});

QUnit.test('geoclient (ambiguous)', function(assert){
	assert.expect(1);

	var me = this, geocoder = new nyc.Geoclient();
	geocoder.on(nyc.Locate.LocateEventType.AMBIGUOUS, function(data){
		assert.deepEqual(data,
			{
				input: '2 broadway',
				possible: [{
					type: nyc.Locate.LocateResultType.GEOCODE,
					coordinates: [980691, 195953],
					accuracy: nyc.Geocoder.Accuracy.HIGH,
					name: '2 Broadway, Manhattan, NY 10004',
					data: me.GEOCLIENT_NOT_OK_RESPONSE.results[0].response	
				},
				{
					type: nyc.Locate.LocateResultType.GEOCODE,
					coordinates: [1031280, 179178],
					accuracy: nyc.Geocoder.Accuracy.HIGH,
					name: '2 Broadway, Queens, NY 11414',
					data: me.GEOCLIENT_NOT_OK_RESPONSE.results[1].response
				},
				{
					type: nyc.Locate.LocateResultType.GEOCODE,
					coordinates: [951503, 172667],
					accuracy: nyc.Geocoder.Accuracy.MEDIUM,
					name: '2 Broadway, Staten Is, NY 10310',
					data: me.GEOCLIENT_NOT_OK_RESPONSE.results[2].response
				}]
		});
	});
	geocoder.geoclient(me.GEOCLIENT_NOT_OK_RESPONSE)
});

QUnit.test('search (zip code)', function(assert){
	assert.expect(1);

	var geocoder = new nyc.Geoclient();
	geocoder.one(nyc.Locate.LocateEventType.GEOCODE, function(data){
		assert.deepEqual(
			data,
			{
				type: nyc.Locate.LocateResultType.GEOCODE,
				coordinates: nyc.Geoclient.ZIP_CODE_POINTS['10038'],
				accuracy: nyc.Geocoder.Accuracy.ZIP_CODE,
				name: '10038',
				zip: true
			}
		);
	});
	geocoder.search('10038');
});

QUnit.test('search (address)', function(assert){
	assert.expect(1);
	var done = assert.async();
	
	var me = this, test = function(data){
		assert.deepEqual(
			data,
			{
				type: nyc.Locate.LocateResultType.GEOCODE,
				coordinates: [982037, 197460],
				accuracy: nyc.Geocoder.Accuracy.HIGH,
				name: '59 Maiden Lane, Manhattan, NY 10038',	
				data: me.GEOCLIENT_OK_ADDRESS_RESPONSE.results[0].response
			}
		);
		done();
	};

	var geocoder = new nyc.Geoclient(this.GEOCLIENT_URL);
	geocoder.one(nyc.Locate.LocateEventType.GEOCODE, test);
	geocoder.search('59 maiden ln mn');
});

QUnit.test('search (error)', function(assert){
	assert.expect(1);
	var done = assert.async();
	
	var test = function(data){
		assert.ok(true);
		done();
	};

	var geocoder = new nyc.Geoclient('');
	geocoder.one(nyc.Locate.LocateEventType.ERROR, test);
	geocoder.search('59 maiden mn');
});
