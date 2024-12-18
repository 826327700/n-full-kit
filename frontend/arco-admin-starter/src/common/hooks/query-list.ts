import { onMounted, ref, Ref, watch } from "vue";


export function usePaginatedQuery<T>(
	requestFn: (query: any) => Promise<any>,
	defaultParams: any,
	immediate = true
) {
	let params=defaultParams;
	const data: Ref<T[]> = ref([]); // 存储请求的数据
	const loading: Ref<boolean> = ref(false); // 加载状态
	const error: Ref<string | null> = ref(null); // 错误信息
	const total: Ref<number> = ref(0); // 数据总数
	const page: Ref<number> = ref(params.page||1); // 当前页
	const pageSize: Ref<number> = ref(params.pageSize||10); // 每页条数

	// 请求分页数据的函数
	const fetchData = async () => {
		loading.value = true;
		error.value = null;

		try {
			const response = await requestFn({
				...params,
				page: page.value,
				pageSize: pageSize.value,
			});
			data.value = response.data.data.list;
			total.value = response.data.data.total;
		} catch (err: any) {
			error.value = err.message || 'Unknown error';
		} finally {
			loading.value = false;
		}
	};

	// 页面切换时重新请求数据
	watch([page, pageSize], fetchData);

	onMounted(()=>{
		if(immediate){
			fetchData();
		}
	})

	const onPageChange=(newPage: number)=> {
		page.value = newPage;
	}

	const onPageSizeChange=(newSize: number)=> {
		pageSize.value = newSize;
	}

	const setParams = (newParams: any) => {
		params=newParams;
	}

	// 返回分页数据、加载状态、错误信息等
	return {
		data,
		loading,
		error,
		total,
		page,
		pageSize,
		fetchData,
		onPageChange,
		onPageSizeChange,
		setParams
	};
}
