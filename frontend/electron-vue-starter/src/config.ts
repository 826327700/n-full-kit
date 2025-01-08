const config={
	//当前环境
	// env: "local",
	// env:'pro'
	env:'dev',
	//发布url
	providerUrl:{
		dev:{
			'win':'https://xxxx/windows/',
			'mac-arm':'https://xxxx/mac-arm/',
			'mac-intel':'https://xxxx/mac-intel/',
		},
		pro:{
			'win':'https://xxxx/windows/',
			'mac-arm':'https://xxxxt/mac-arm/',
			'mac-intel':'https://xxxx/mac-intel/',
		}
	}
}
// module.exports=config
export default config
