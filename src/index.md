---
title: Overview
layout: default.njk
---


## DE

<ul>
{%- for item in collections.paintingsDE -%}
  <li><a href="de/paintings/{{item.metadata.id}}">{{item.metadata.title}}</a></li>
{%- endfor -%}
</ul>
