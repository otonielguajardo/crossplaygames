<div class="row py-3 gx-3 gy-3">
	<div class="col-sm-2 col-6">
		<select id="platform_a" class="form-control form-control-sm" onchange="applyFilter()">
			<option value="">All</option>
			@foreach ($page->data->platforms as $platform)
				<option value="{{ sluggify($platform) }}">{{ $platform }}</option>
			@endforeach
		</select>
	</div>
	<div class="col-sm-2 col-6">
		<select id="platform_b" class="form-control form-control-sm" onchange="applyFilter()">
			<option value="">All</option>
			@foreach ($page->data->platforms as $platform)
				<option value="{{ sluggify($platform) }}">{{ $platform }}</option>
			@endforeach
		</select>
	</div>
	<div class="col">
		<input id="q" type="search" class="form-control form-control-sm" placeholder="Search titles..." onsearch="applyFilter()" />
	</div>
	<div class="col-auto">
		<button class="btn btn-sm btn-primary" onclick="clearFilter()">
			Clear
		</button>
	</div>
	<div class="col" style="max-width: 45px">
		<a href="{{ $page->repoUrl }}" target="_blank" class="btn btn-sm btn-primary">
			<img class="img-fluid" src="/assets/images/info.svg" alt="" />
		</a>
	</div>
</div>