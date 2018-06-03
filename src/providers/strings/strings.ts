import { Injectable } from '@angular/core';

/*
  Generated class for the StringsProvider provider.

  See https=//angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StringsProvider {
	
	constructor() {
	}
	  
	/** exit buttons */
	doYouWantExit = "bạn có thực sự muốn th oát khỏi ứng dụng";
	doYouSignout = "Bạn muốn đăng xuất?";
	yesBtn = "CÓ";
	noBtn = "Không";

	/** Error Messages */
	passcodeNotMatch = "Passwords doesn't match";
	noNetwork = "Lỗi kết nối mạng";
	serverError = "Lỗi kết nối, vui lòng thử lại";
	pleaseWait = "Vui lòng đợi";
	noData= "Không có dữ liệu";

	/**validation Messages */
	passcodedoesntmatch = "Mật mã không khớp";
	passcodeblocked = "Mật mã đã bị khóa";
	passcodeIsExpired = "Mật mã đã hết hạn";
	authenticationFail = "Không thể chứng thực";
	wrongpasscode   = "Nhập sai mật mã";
	PasscodeValidationFail = "Xác thực mật mã thất bại";
	thisFiledIsRequired = "Thông tin này là bắt buộc";
	specialcharAreNotAllowed = "Không sử dụng ký tự đặc biệt";
	minLengthShould  = "Số ký tự tối đa là 4";
	minLengthShould8 = "Số ký tự tối đa là 8";
	passwordReq = "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt:!, @, #, $, (, Hoặc)";
	
	/** Strings for Side menu Screen */
	profile = "ĐÀO VIẾT HƯƠNG";
	changePswd = "Đổi mật khẩu";
	logout = "Đăng xuất";
	home = "Trang chủ";
	search = "Tìm kiếm";
	appraisalStatus = "Tình trạng thẩm định";
	licenseIssued = "HĐ đã phát hành";
	insuranceFee = "Tình trạng yêu cầu bồi thường";
	termsOfUse = "Điều khoản sử dụng";
	underwriting = "Chờ thẩm định";
	supplementation = "Yêu cầu bổ sung thông tin";
	healthCheck = "Yêu cầu khám sức khỏe";
	acceptanceLetter = "Yêu cầu thư thỏa thuận";
	waitingForAck = "Chờ biên nhận bàn giao";
	inGracePeriod = "Trong thời hạn cân nhắc";
	cancelGraceInPeriod = "Hủy trong thời hạn cân nhắc";
	inPremiumPeriod = "Đến hạn thu phí";
	lapsed = "Mất hiệu lực";
	
	/** Strings for Home Screen */
	summaryHeading = "BẢNG TÓM TẮT";
	gridHeading = "TÍNH NĂNG CHÍNH";
	conditionsOfContract = "TÌNH TRẠNG HỢP ĐỒNG";
	calendar = "Lịch";
	searchOfContarct = "TÌM KIẾM HỢP ĐỒNG";
	personalReport = "BÁO CÁO CÁ NHÂN";
	groupReports = "BÁO CÁO NHÓM";
	mdrt = "MDRT";
	sunElite = "SUN ELITE";
	yearReport = "BÁO CÁO NĂM";
	income = "THU NHẬP";
	intrestRate = "LÃI SUẤT";
		
	/** Strings for Footer */
	menuTxt = "Menu";
	statusOfContract = "Tình trạng HĐ";
	contractSearch = "Tìm kiếm HĐ";
	licence = "@2017 Sun Life Việt Nam. Bảo lưu mọi quyền lợi.";
	
	/** Strings for Profile Screen */
	account = "TÀI KHOẢN";
	mine = "CỦA TÔI";
	metamorphose = "Đổi hình";
	firstName = "Họ và tên:";
	office = "Văn phòng:";
	position = "Vị trí (chức vụ):";
	joinDate = "Ngày tham gia:";
	certificateNo = "Chứng chỉ TVTC số:";
	expiryDate = "Ngày hết hạn:";
	directManagement = "Quản lý trực tiếp:";
	birthday = "Ngày sinh:";
	currentOccupation = "Nghề nghiệp hiện tại:";
	education = "Education level:";
	email = "Email:";
	phone = "Điện thoại:";
	
	/** Strings for Login Screen */
	forgotPswd = "Quên mật khẩu?";
	login = "Đăng nhập";
	username = "Tên truy cập";
	password = "Mật khẩu";
	passwordlink ="Quên mật khẩu";
	
	/** Strings for Forget Passwrod Screen */
	or = "hoặc";
	
	/** Strings for Slide Details screen */
	emulationPrgm = "Chương trình thi đua";
	viewAll = "Xem tất cả";
	
	/** Strings For slide List Screen */
	news = "Tin tức - thông báo";
	
	/** Strings for Pending UnderWritting Screen */
	mainProduct = "Sản phẩm chính";
	dateReceived = "Ngày nhận hồ sơ";
	investor = "SĐT Bên mua bảo hiểm";
	pending = "CHỜ THẨM ĐỊNH";
	supplemenatroy_info = "CHỜ BỔ SUNG THÔNG TIN";
	medical_exam = "CHỜ KHÁM SỨC KHỎE";
	acceptance_letter = "CHỜ KÝ THƯ THỎA THUẬN";
	
	/** Strings for policy status screen */	
	policyStatusTitle = "THÔNG TIN HỢP ĐỒNG";
	tab2Title = "ĐÃ PHÁT HÀNH";
	
	/** Strings for policy search screen */	
	claimNo = "Số hồ sơ yêu cầu bảo hiểm";
	numOfContracts = "Số hợp đồng";
	insuranceBuyer = "Bên mua bảo hiểm";
	insuranceBuyerPolicy = "Bên mua BH";
	premiumDueDatePolicy = "Ngày đáo hạn HĐ";
	codeTVTC = "Mã TVTC";
	nameOfTVTC = "Tên TVTC";
	submitBtn = "Gửi";
	
	/** Strings for Waiting For Ack screen */
	policyOwner = "Chủ sở hữu chính sách";
	planName = "Tên kế hoạch";
	endOfAck = "Cuối Lời cảm ơn";
	product = "Sản phẩm";
	faceAmount = "Số tiền mặt";
	paymentMode = "Chế độ thanh toán";
	premium = "Phí bảo hiểm";
	paymentType = "Hình thức thanh toán";
	settleDate = "Định ngày";
	
	/** Strings for Policy in Grace Period screen */
	hd = "HĐ";
	
	/** Strings for policy cancelled in grace period */
	cancelPeriodCardTitle = "HĐ BỊ HỦY";
		
	/** Strings for in premium period screen */
	premiumDueDate = "Ngày hết hiệu lực";
	
	/** Strings for claim status screen */
	claimTitle = "CHỜ THẨM ĐỊNH";
	claimSubTitle = "KẾT QUẢ TRÍCH LỤC";
	id = "Số hồ sơ yêu cầu BH";
	buyerBH = "Bên mua BH";
	request = "Yêu cầu";
	agencyName = "Tên đại lý";

	/**strings for income */
	dateOfPayment = "Ngày thanh toán";
	actualRceipts = "Thu nhập thực nhận (vnd)";
	incomeDetail= "Chi tiết thu nhập";
	incomeTitle ="THU NHẬP";
	seeDetails = "Xem chi tiết";
	incomeDetailsLoadError = "Unable to load Income details. Please try again";
	
	/** Strings for change password screen */
	changePswdTitle = "THAY ĐỔI MẬT KHẨU";
	newPswd = "Nhập mật khẩu mới";
	confirmPswd = "Nhập lại mật khẩu mới";
	
	/** Strings for Passcode Screen */
	passcodeLoginTitle ="Nhập mật mã";
	passcodeRegisterTitle ="Nhập mật mã";
	passcodeRepeatTitle ="Xác nhận mật mã";
	changePasscode = "Bạn đã thay đổi mật khẩu thành công";

	/** popup  */
	popUpOk = "OK";
	
	/** Strings for Individual Performance */
	resultOfPersonal = "KẾT QUẢ KINH DOANH CÁ NHÂN";
	day = "NGÀY";
	totalInsuranceCost = "FYP - TỔNG PHÍ BẢO HIỂM NĂM ĐẦU";
	unitMillion = "(đơn vị triệu đồng)";
	reportInMonth = "Trong tháng";
	reportInYear = "Trong năm";
	reportLastYear = "Trong quý";
	personalIncome1 = "DOANH SỐ PHÒNG";
	personalIncome2 = "DOANH SỐ NHÓM";
	personalIncome = "CÁ NHÂN";
	month = "THÁNG";
	precious = "QUÝ";
	year = "NĂM";
	individualColTitle1 = "IP";
	individualColTitle2 = "Số HĐ<br>nộp vào";
	individualColTitle3 = "Số HĐ<br>phát hành";
	individualColTitle4 = "Số HĐ<br>hủy";
	currentRatio = "TỶ LỆ DUY TRÌ HĐ : ";
	
	/** Strings for Group Performance */	
	teamIncome = "ĐỘI NGŨ TƯ VẤN TÀI CHÍNH";
	groupColTitle1 = "Số lượng<br>TVTC";
	groupColTitle2 = "Số lượng<br>hoạt động";
	groupColTitle3 = "Số lượng<br>tuyển dụng";
	groupColTitle4 = "Số lượng<br>TVTC nghỉ<br>việc";
	group_performance_title = "BÁO CÁO KINH DOANH NHÓM";
	
	/** Strings for MDRT Screen */
	mdrttitle = "THI ĐUA MDRT";	
	profitheading = "THÀNH QUẢ CỦA BẠN";
	profitTitle3Unit = "Số lượng Tư vấn hoạt động cần:";
	profitTitle3branch = "Số lượng UM/SUM thuộc Phòng cần:";
   	FYPnextlevel = "FYP cần để đạt mức tiếp theo:";
   	timeRemaining = "Thời gian còn lại:";
   	minimum = "Bạn cần đạt tối thiểu:";
	mdrtNote1 = "Các điều kiện thi đua như Thông báo số No.033/SLFI-Agency/EM/I/2016";
	mdrtNote2 = "Lưu ý: báo cáo này chỉ mang tính theo dõi. Kết quả cuối cùng sẽ được công bố vào cuối chương trình thi đua.";
	achievment = "DANH HIỆU HIỆN TẠI: ";
	
	/** Strings for Full Year Report Screen */
	fullYearTitle = "CHINH PHỤC CANADA";
	fullYearTab2 = "NHÓM";
	fullYearTab3 = "PHÒNG";
	profitHeading = "DOANH SỐ CẦN ĐẠT MỨC TIẾP THEO";
	profitTitle1 = "IP cần để đạt mức tiếp theo:";
	profitTitle2 = "IP sản phẩm bổ trợ đính kèm cần:";
	profitTitle3 = "SỐ lượng hợp đồng cần:";
	profitTitle4 = "Số lượng tư vấn mới hoạt động cần:";
	ticketInfoTitle = "IP cần để đạt mức tiếp theo:";
	ticketAFYP = "AFYP cần thêm để đạt 1 vé đi Thượng Hải / Umroh:";
	targetNum = "Chỉ tiêu số HĐ:";
	targetSaleRate = "Chỉ tiêu tỉ lệ duy trì HĐ:";
	remainingTime = "Thời gian còn lại:";
	
	/** Strings for SunElite Screen */
	nextLvlFYP = "FYP cần để đạt mức tiếp theo:";
	time = "Thời gian";
	today = "Hôm nay";
	FYP = "FYP";

	/** Strings for pending underwriting details screen */
	underwritingDetail1 = "Người được bảo hiểm";
	underwritingDetail2 = "Ngày bắt đầu có yêu cầu Thẩm định";
	underwritingDetail3 = "Ngày hết hạn yêu cầu Thẩm định";
	underwritingDetail4 = "Tổng số ngày chờ bổ sung thông tin";
	underwritingDetail6 = "Chi tiết yêu cầu";

	/** Strings for Pending Issued Screen */
	expiryDateOfRecipt = "Ngày hết hạn yêu cầu Biên nhận bàn giao";
	policyInvalidDate = "Ngày mất hiệu lực";	
	departureDate = "Ngày phàt hành";
	feedueDate = "Ngày đến hạn thu phí";
	premiumDue = "Phí đến hạn đóng";
	cancellationDate = "Ngày huỷ hợp đồng";
	requriedExpiryDate = "Ngày hết hạn yêu cầu";
	noOfDaysForDelivery = "Tổng số ngày cho biên nhận bàn giao";
	all = "TẤT CẢ";
}
