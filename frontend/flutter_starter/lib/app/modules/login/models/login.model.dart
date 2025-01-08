
class LoginForm {
	String userName;
	String passWord;
	String loginType;

	LoginForm({required this.userName, required this.passWord,required this.loginType});

	Map<String, dynamic> toJson() {
		final data = <String, dynamic>{};
		data['userName'] = userName;
		data['passWord'] = passWord;
		data['loginType'] = loginType;
		return data;
  	}
}
class LoginRes {
  User? user;
  String? token;

  LoginRes({this.user, this.token});

  LoginRes.fromJson(Map<String, dynamic> json) {
    user = json['user'] != null ? User?.fromJson(json['user']) : null;
    token = json['token'];
  }

  Map<String, dynamic> toJson() {
    final data = <String, dynamic>{};
    if (user != null) {
      data['user'] = user?.toJson();
    }
    data['token'] = token;
    return data;
  }
}

class User {
  String? sId;
  String? nickName;
  String? userName;
  String? userType;
  String? avatarUrl;
  int? gender;
  String? realName;
  String? phone;
  List<String>? access;
  String? status;
  String? createdAt;
  String? updatedAt;
  int? iV;

  User(
      {this.sId,
      this.nickName,
      this.userName,
      this.userType,
      this.avatarUrl,
      this.gender,
      this.realName,
      this.phone,
      this.access,
      this.status,
      this.createdAt,
      this.updatedAt,
      this.iV});

  User.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    nickName = json['nickName'];
    userName = json['userName'];
    userType = json['userType'];
    avatarUrl = json['avatarUrl'];
    gender = json['gender'];
    realName = json['realName'];
    phone = json['phone'];
    if (json['access'] != null) {
      access = <String>[];
      json['access'].forEach((v) {
        access?.add(v);
      });
    }
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final data = <String, dynamic>{};
    data['_id'] = sId;
    data['nickName'] = nickName;
    data['userName'] = userName;
    data['userType'] = userType;
    data['avatarUrl'] = avatarUrl;
    data['gender'] = gender;
    data['realName'] = realName;
    data['phone'] = phone;
    if (access != null) {
      data['access'] = access?.map((v) => v).toList();
    }
    data['status'] = status;
    data['createdAt'] = createdAt;
    data['updatedAt'] = updatedAt;
    data['__v'] = iV;
    return data;
  }
}
