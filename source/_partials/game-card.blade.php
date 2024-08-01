<div class="col-md-4 col-sm-6 col-12 game">
	<div class="card mb-3">
		<div class="row g-0">
			<div class="col" style="max-width: 70px">
				<img src="{{ $game->cover }}" class="rounded-start cover" alt="{{ $game->title }}" />
			</div>
			<div class="col">
				<div class="card-body p-2">
					<h5 class="card-title mb-1">
						{{ $game->title }}
					</h5>
					<div>
						<ul class="d-flex flex-wrap">
							@foreach ($game->platforms as $platform)
								<li onclick="selectPlatform('{{ sluggify($platform) }}')">
									<span class="badge rounded-pill me-1 border text-bg-dark border-dark" data-platform="{{ sluggify($platform) }}">
										{{ $platform }}
									</span>
								</li>
							@endforeach
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>