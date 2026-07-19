---
title: Deleting Managed Metadata Fields via PowerShell
description: "PowerShell script to remove the hidden Note fields SharePoint leaves behind when deleting taxonomy fields, fixing duplicate field name errors."
date: '2015-01-08'
tags:
  - Managed Metadata Fields
  - Provisioning
---
<strong>Scenario</strong>
When you provision a Managed Metadata (Taxonomy) field in SharePoint, it creates a hidden field (of type Note) along with the main taxonomy field. What happens when you delete that field? You would expect the other one to be deleted as well, right? Not that easy :)

SharePoint for some reason doesn’t delete that hidden field. So when you provision the field again with the same name, it simply increments the number for the hidden field. Let’s say your field is called MyTax1. The hidden field will be named MyTax1_0. Now if MyTax1_0 already exists, SharePoint will create MyTax1_1 and so on. This is applicable when you working from the interface with OOB functionality.

<strong>Problem</strong>
What if you are provisioning taxonomy fields through code or PowerShell where you provision certain fields, associate them with the content types etc. Moreover, during the development/testing phase, you might need to delete those fields and re-provision them number of times before your code is production ready.
Well, if thats the case then most likely you will end with the following exception.
<blockquote>A duplicate field name dd93a2825ad24eef8e3e1cf4f2e96a40 was found</blockquote>
Reason? The hidden field is not deleted yet and your code is trying to create the field with the same name.

If you check it with <a title="SharePoint Manager 2013" href="https://web.archive.org/web/20160108124745/http://spm.codeplex.com/" target="_blank">SharePoint Manager 2013</a> you can see that this Guid is the internal name of the hidden taxonomy field

<strong>Solution</strong>
In order to get around this issue, we need to make sure that hidden Note field is also removed. I wrote few lines of PowerShell script to delete those hidden fields as well. Here is the code snippet.

<?# Gist 7a7514d19b59f0093ac1 /?>
<!-- https://gist.github.com/sanjaybhagia/7a7514d19b59f0093ac1 -->

Hope it helps. Cheers.
