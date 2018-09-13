<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<title>도로명 주소</title>
</head>
<script type="text/javascript" src="/js/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="./resources/js/jusoPopup.js"></script>
<script type="text/javascript" src="./resources/js/toolBar.js"></script>
<script language="javascript">
</script>
<body>
	<div>
		<input type="text" name="searchKeyword" id="inputSearchAddr"  maxlength="60" style="ime-mode:active;">
		<button onclick="_JusoPopup.makeOption(true)">검색</button>
	</div>
	<div>
		<table>
			<thead>
				<tr>
					<th>도로명주소</th>
				</tr>
			</thead>
			<tbody id="juso-tbody">
				<tr>
					<td>
					</td>
				</tr>
			</tbody>
		</table>
		
	</div>
</body>
</html>