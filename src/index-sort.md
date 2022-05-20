---
title: Overview
layout: default.njk
---

<style>

figure{
  display: flex;
  flex-direction: row;
  gap: 10px;
  border-bottom: solid 1px #ededed;
  padding-bottom: 2px;
  margin-bottom: 2px;
}

.img-wrap{
  width: 100px;
  height: 100px;
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
{%- for item in collections.allObjectsDE -%}
  <li class="overview-item">
  <a href="../../de/{{item.metadata.id}}">
    <figure>
      <div class="img-wrap">
        <img src="{{item.metadata.imgSrc}}">
      </div>
      <figcaption>{{item.metadata.title}}<br>{{item.metadata.id}}<br>{{item.sortingInfo.year}}-{{item.sortingInfo.position}}</figcaption>
    </figure>
  </a>
  </li>
{%- endfor -%}
</ul>

