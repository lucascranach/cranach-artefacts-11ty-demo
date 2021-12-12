---
title: Overview
layout: default.njk
---

<style>

.overview{
  display: grid;
  grid-template-columns: repeat( auto-fit, minmax(200px, 1fr) );
  gap: 10px;
}

.img-wrap{
  width: 200px;
  height: 200px;
  background-color: #efefef;
}

img{
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
}

figcaption{
  padding-top: 10px;
}

</style>
## DE

<ul class="overview">
{%- for item in collections.paintingsDE -%}
  <li class="overview-item">
  <a href="../../de/paintings/{{item.metadata.id}}">
    <figure>
      <div class="img-wrap">
        <img src="{{item.metadata.imgSrc}}">
      </div>
      <figcaption>{{item.metadata.title}}<br>{{item.metadata.id}}<br>{{item.sortingNumber}}</figcaption>
    </figure>
  </a>
  </li>
{%- endfor -%}
</ul>

<ul class="overview">
{%- for item in collections.graphicsRealObjectsDE -%}
  <li class="overview-item">
  <a href="../../de/graphics/{{item.metadata.id}}">
    <figure>
      <div class="img-wrap">
        <img src="{{item.metadata.imgSrc}}">
      </div>
      <figcaption>{{item.metadata.title}}<br>{{item.metadata.id}}<br>{{item.sortingNumber}}</figcaption>
    </figure>
  </a>
  </li>
{%- endfor -%}
</ul>

<ul class="overview">
{%- for item in collections.graphicsVirtualObjectsDE -%}
  <li class="overview-item">
  <a href="../../de/graphics/{{item.metadata.id}}">
    <figure>
      <div class="img-wrap">
        <img src="{{item.metadata.imgSrc}}">
      </div>
      <figcaption>{{item.metadata.title}}<br>{{item.metadata.id}}<br>{{item.sortingNumber}}</figcaption>
    </figure>
  </a>
  </li>
{%- endfor -%}
</ul>
