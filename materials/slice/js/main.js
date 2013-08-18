
$(document).ready(function() {

	$('#pl_btn').click(function(event) {
		if ( $("#playlist_box").hasClass("active") ) {
			$('#playlist_box').hide();
			$('#playlist_box').removeClass('active');
		}else{
			$('#playlist_box').show();
			$('#playlist_box').addClass('active');
		}	
    });

	$('#add_btn').click(function(event) {
		if ( $("#add_box").hasClass("active") ) {
			$('#add_box').hide();
			$('#add_box').removeClass('active');
		}else{
			$('#add_box').show();
			$('#add_box').addClass('active');
		}	
    });

	var dragSrcEl = null;

	var cols = document.querySelectorAll('#playlist_panel .column');
	[].forEach.call(cols, function(col) {
	  col.addEventListener('dragstart', handleDragStart, false);
	  col.addEventListener('dragenter', handleDragEnter, false)
	  col.addEventListener('dragover', handleDragOver, false);
	  col.addEventListener('dragleave', handleDragLeave, false);
	  col.addEventListener('drop', handleDrop, false);
	  col.addEventListener('dragend', handleDragEnd, false);
	});

	function handleDragStart(e) {
	  // Target (this) element is the source node.
	  dragSrcEl = this;

	  e.dataTransfer.effectAllowed = 'move';
	  e.dataTransfer.setData('text/html', this.innerHTML);
	}

	function handleDragEnter(e) {

	}

	function handleDragOver(e) {
	  if (e.preventDefault) {
	    e.preventDefault(); // Necessary. Allows us to drop.
	  }
	  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
	  return false;
	}

	function handleDragLeave(e) {

	}

	function handleDrop(e) {
	  if (e.stopPropagation) {
	    e.stopPropagation(); // Stops some browsers from redirecting.
	  }

	  // Don't do anything if dropping the same column we're dragging.
	  if (dragSrcEl != this) {

	    // Set the source column's HTML to the HTML of the columnwe dropped on.
	    dragSrcEl.innerHTML = this.innerHTML;
	    this.innerHTML = e.dataTransfer.getData('text/html');

	  }
	  return false;
	}

	function handleDragEnd(e) {

	}

	var cols = document.querySelectorAll('#playlist_panel .column');
	[].forEach.call(cols, function(col) {
	  col.addEventListener('dragstart', handleDragStart, false);
	  col.addEventListener('dragenter', handleDragEnter, false)
	  col.addEventListener('dragover', handleDragOver, false);
	  col.addEventListener('dragleave', handleDragLeave, false);
	  col.addEventListener('drop', handleDrop, false);
	  col.addEventListener('dragend', handleDragEnd, false);
	});


});
